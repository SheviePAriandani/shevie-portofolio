"""Makes a simple pastel placeholder for assets/images/og-image.jpg (1200x630).
Replace it with a real image when you have one."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
W, H = 1200, 630
PLUM = (58, 47, 75)
img = Image.new("RGB", (W, H), (255, 248, 240))
d = ImageDraw.Draw(img)

# soft pastel blobs
for (cx, cy, r, col) in [(130, 110, 260, (255, 200, 221)), (1090, 540, 300, (205, 231, 255)),
                          (1010, 90, 170, (217, 204, 255)), (170, 580, 190, (205, 239, 224))]:
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)

def font(names, size):
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()

big = font(["ARLRDBD.TTF", "arialbd.ttf", "segoeuib.ttf"], 88)
mid = font(["ARLRDBD.TTF", "arial.ttf", "segoeui.ttf"], 38)

# sticker card
d.rounded_rectangle((100 + 12, 150 + 12, 1100 + 12, 480 + 12), radius=40, fill=PLUM)
d.rounded_rectangle((100, 150, 1100, 480), radius=40, fill=(255, 253, 249), outline=PLUM, width=5)
# cat ears on the card
for x in (170, 880):
    d.polygon([(x, 150), (x + 40, 80), (x + 90, 150)], fill=PLUM)
    d.polygon([(x + 22, 150), (x + 42, 108), (x + 68, 150)], fill=(255, 200, 221))
d.text((W // 2, 275), "Shevie Putri Ariandani", font=big, fill=PLUM, anchor="mm")
d.text((W // 2, 375), "Informatics student, Universitas Ahmad Dahlan", font=mid, fill=(91, 78, 112), anchor="mm")
d.text((W // 2, 430), "Portfolio", font=mid, fill=(168, 69, 122), anchor="mm")

out = ROOT / "assets" / "images" / "og-image.jpg"
img.save(out, quality=85)
print("wrote", out)
