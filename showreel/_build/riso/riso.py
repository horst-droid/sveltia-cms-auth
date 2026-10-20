import sys, numpy as np
from PIL import Image, ImageFilter
RED=np.array([255,66,85])/255.; INK=np.array([28,24,27])/255.; PAPER=np.array([239,232,220])/255.
rng=np.random.default_rng(7)
def halftone(val, cell, ang, shape):
    h,w=shape; yy,xx=np.mgrid[0:h,0:w].astype(float)
    c,s=np.cos(ang),np.sin(ang); u=(xx*c+yy*s)/cell; v=(-xx*s+yy*c)/cell
    du=u-np.round(u); dv=v-np.round(v); d=np.sqrt(du*du+dv*dv)          # distance to dot centre (cells)
    r=np.sqrt(np.clip(val,0,1)/np.pi)*1.05                                 # dot radius for coverage
    return np.clip((r-d)*cell*0.9+0.5,0,1)                                 # antialiased dots
def riso(src, out, width=1000, red_mid=0.07, crop=None):
    im=Image.open(src).convert('RGB')
    if crop: im=im.crop(crop)
    im=im.resize((width, int(im.height*width/im.width)), Image.LANCZOS)
    a=np.asarray(im).astype(float)/255.; h,w,_=a.shape
    L=0.3*a[...,0]+0.59*a[...,1]+0.11*a[...,2]
    L=np.clip((L-0.14)/0.72,0,1)**0.85
    redness=np.clip((a[...,0]-np.maximum(a[...,1],a[...,2])-0.10)*3.2,0,1)*(a[...,0]>0.35)
    black=halftone((1-L)**1.5, 5.2, np.radians(45), (h,w))
    redv=np.clip(redness*0.95 + red_mid*(1-L)*(1-redness), 0, 1)
    red=halftone(redv, 5.6, np.radians(15), (h,w))
    red=np.roll(red,(3,4),axis=(0,1))                                       # misregistration
    speck=rng.random((h,w)); black*= (speck>0.04); red*=(rng.random((h,w))>0.06)
    blot=np.asarray(Image.fromarray((rng.random((h//24+1,w//24+1))*255).astype('uint8')).resize((w,h),Image.BICUBIC)).astype(float)/255.
    red*=0.75+0.35*blot; black*=0.85+0.2*blot
    img=PAPER*np.ones((h,w,3))
    img=img*(1-red[...,None]*(1-RED))                                       # multiply red ink
    img=img*(1-black[...,None]*(1-INK))                                     # multiply black ink
    grain=(rng.random((h,w))-0.5)*0.05; img=np.clip(img+grain[...,None],0,1)
    Image.fromarray((img*255).astype('uint8')).save(out, quality=90)
if __name__=='__main__':
    riso(sys.argv[1], sys.argv[2])
