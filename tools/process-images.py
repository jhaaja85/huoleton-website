from PIL import Image, ImageFilter, ImageChops
import sys, os
from collections import deque
src=r'C:\Users\juhah\AppData\Local\Temp\claude\C--Users-juhah-OneDrive-Asiakirjat-Claude\463ebd7f-ca31-4d5e-b33e-c39084a41a2c\images'
out=r'C:\Users\juhah\OneDrive\Asiakirjat\Claude\huoltokirja\website\src\assets'
names={1:'app-koti',2:'app-kuittaus',3:'app-pts',4:'app-tilastot',5:'logo'}
for i,n in names.items():
    im=Image.open(f'{src}\\{i}.webp').convert('RGB')
    w,h=im.size
    px=im.load()
    bg=[[False]*w for _ in range(h)]
    thr=228
    q=deque()
    for x in range(w):
        for y in (0,h-1): q.append((x,y))
    for y in range(h):
        for x in (0,w-1): q.append((x,y))
    while q:
        x,y=q.popleft()
        if x<0 or y<0 or x>=w or y>=h or bg[y][x]: continue
        if min(px[x,y])<thr: continue
        bg[y][x]=True
        q.extend([(x+1,y),(x-1,y),(x,y+1),(x,y-1)])
    mask=Image.new('L',(w,h),255)
    mp=mask.load()
    for y in range(h):
        for x in range(w):
            if bg[y][x]: mp[x,y]=0
    mask=mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba=im.copy(); rgba.putalpha(mask)
    bbox=mask.point(lambda v:255 if v>40 else 0).getbbox()
    pad=6
    bbox=(max(0,bbox[0]-pad),max(0,bbox[1]-pad),min(w,bbox[2]+pad),min(h,bbox[3]+pad))
    rgba=rgba.crop(bbox)
    print(n,rgba.size)
    if n=='logo':
        rgba.save(f'{out}\\{n}.png',optimize=True)
    else:
        rgba.save(f'{out}\\{n}.webp',quality=90,method=6)
Image.open(f'{src}\\6.webp').convert('RGB').save(f'{out}\\feature.webp',quality=88)
Image.open(f'{src}\\6.webp').convert('RGB').save(f'{out}\\og.jpg',quality=88)
logo=Image.open(f'{out}\\logo.png')
for s in (32,180,512): logo.resize((s,s),Image.LANCZOS).save(f'{out}\\logo-{s}.png')
logo.resize((48,48),Image.LANCZOS).save(f'{out}\\favicon.ico')
