"""Cuts the supplied phone mockups out of their white background and writes them to src/assets/<locale>/.
Usage: python tools/process-images.py   (edit SRC / MAP below when new screenshots arrive)"""
import io, json, os
from collections import deque
from PIL import Image, ImageFilter

SRC = r'C:\Users\juhah\AppData\Local\Temp\claude\C--Users-juhah-OneDrive-Asiakirjat-Claude\463ebd7f-ca31-4d5e-b33e-c39084a41a2c\images'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'assets')
MAP = {
    'fi': {12: 'app-koti', 13: 'app-kuittaus', 14: 'app-mittaus', 15: 'app-pts', 16: 'app-tilastot'},
    'en': {17: 'app-koti', 18: 'app-kuittaus', 19: 'app-mittaus', 20: 'app-pts', 21: 'app-tilastot'},
}
FEATURE = {'fi': 6, 'en': 22}

def cutout(im, thr=228):
    w, h = im.size
    px = im.load()
    bg = [[False] * w for _ in range(h)]
    q = deque([(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)])
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or bg[y][x] or min(px[x, y]) < thr:
            continue
        bg[y][x] = True
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    mask = Image.new('L', (w, h), 255)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                mp[x, y] = 0
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.copy()
    rgba.putalpha(mask)
    b = mask.point(lambda v: 255 if v > 40 else 0).getbbox()
    pad = 6
    return rgba.crop((max(0, b[0] - pad), max(0, b[1] - pad), min(w, b[2] + pad), min(h, b[3] + pad)))

def find(n):
    for ext in ('webp', 'png'):
        p = os.path.join(SRC, f'{n}.{ext}')
        if os.path.exists(p):
            return p
    raise FileNotFoundError(n)

for loc, files in MAP.items():
    d = os.path.join(OUT, loc)
    os.makedirs(d, exist_ok=True)
    sizes = {}
    for n, name in files.items():
        im = cutout(Image.open(find(n)).convert('RGB'))
        im.save(os.path.join(d, name + '.webp'), quality=90, method=6)
        sizes[name] = list(im.size)
    feat = Image.open(find(FEATURE[loc])).convert('RGB')
    feat.save(os.path.join(d, 'feature.webp'), quality=88)
    sizes['feature'] = list(feat.size)
    # 1200x630 social preview derived from the feature graphic
    h = 630
    og = feat.resize((round(feat.width * h / feat.height), h), Image.LANCZOS)
    og.crop((12, 0, 1212, h)).save(os.path.join(OUT, f'og-{loc}.jpg'), quality=88, optimize=True)
    io.open(os.path.join(d, 'sizes.json'), 'w').write(json.dumps(sizes, indent=1))
    print(loc, sizes)
