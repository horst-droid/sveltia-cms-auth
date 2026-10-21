#!/usr/bin/env python3
"""Runway image-to-video for HORST clips.

Usage:
  python3 runway.py <bild.jpg|png> "<prompt>" [--ratio 720:1280] [--seconds 5] [--out clip.mp4]

Needs ONE of:
  - a Network secret on the cloud environment for host api.dev.runwayml.com
    (Secret type Bearer, header Authorization, prefix Bearer, value = Runway key);
    the agent proxy then adds the key to every request, this script never sees it
  - or RUNWAY_API_KEY as an environment variable (local use)

Writes the finished MP4 to --out (default: runway-<timestamp>.mp4).
"""
import base64, json, mimetypes, os, sys, time, urllib.request, urllib.error

API = "https://api.dev.runwayml.com/v1"
VERSION = "2024-11-06"


def req(method, path, body=None):
    headers = {"X-Runway-Version": VERSION, "Content-Type": "application/json"}
    key = os.environ.get("RUNWAY_API_KEY")
    if key:  # local use; in the cloud the Network secret (agent proxy) supplies the header
        headers["Authorization"] = f"Bearer {key}"
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(API + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            sys.exit(f"Runway {e.code}: kein Key angekommen. Network secret für api.dev.runwayml.com in der Umgebung anlegen, dann neue Session.")
        sys.exit(f"Runway {e.code}: {e.read().decode()[:500]}")


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    img, prompt = argv[0], argv[1]
    opts = dict(zip(argv[2::2], argv[3::2]))
    ratio = opts.get("--ratio", "720:1280")
    seconds = int(opts.get("--seconds", "5"))
    out = opts.get("--out", f"runway-{int(time.time())}.mp4")
    mime = mimetypes.guess_type(img)[0] or "image/jpeg"
    with open(img, "rb") as f:
        data_uri = f"data:{mime};base64," + base64.b64encode(f.read()).decode()
    task = req("POST", "/image_to_video", {
        "model": "gen4_turbo", "promptImage": data_uri, "promptText": prompt,
        "ratio": ratio, "duration": seconds})
    tid = task["id"]
    print("Task", tid, "läuft …", flush=True)
    while True:
        time.sleep(8)
        t = req("GET", f"/tasks/{tid}")
        st = t.get("status")
        print(" ", st, flush=True)
        if st == "SUCCEEDED":
            url = t["output"][0]
            urllib.request.urlretrieve(url, out)
            print("fertig:", out)
            return
        if st in ("FAILED", "CANCELLED"):
            sys.exit(f"Runway: {st} – {t.get('failure') or t.get('failureCode')}")


if __name__ == "__main__":
    main(sys.argv[1:])
