import glob
from PIL import Image
import os

def optimize_images():
    img_dir = "images"
    
    # 1. hero-bg-new.png -> hero-bg-new.webp (highly compressed)
    hero_path = os.path.join(img_dir, "hero-bg-new.png")
    if os.path.exists(hero_path):
        with Image.open(hero_path) as im:
            # Resize if it's too big, 1024x1024 to perhaps 800 width (preserving ratio)
            # Actually just save as webp
            webp_path = os.path.join(img_dir, "hero-bg-new.webp")
            im.save(webp_path, "WEBP", quality=75, method=6)
            print(f"Converted {hero_path} -> {webp_path}")

    # 2. og-image.png -> og-image.jpg
    og_path = os.path.join(img_dir, "og-image.png")
    if os.path.exists(og_path):
        with Image.open(og_path) as im:
            # Convert RGBA to RGB for JPEG
            if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                alpha = im.convert('RGBA').split()[-1]
                bg = Image.new("RGB", im.size, (255, 255, 255))
                bg.paste(im, mask=alpha)
                im = bg
            else:
                im = im.convert('RGB')
            # Scale exactly to 1200x630 keeping aspect ratio and padding with background
            im.thumbnail((1200, 630), Image.Resampling.LANCZOS)
            bg_pad = Image.new("RGB", (1200, 630), (15, 23, 42)) # tailwind slate-900 roughly
            x = (1200 - im.width) // 2
            y = (630 - im.height) // 2
            bg_pad.paste(im, (x, y))
            jpg_path = os.path.join(img_dir, "og-image.jpg")
            bg_pad.save(jpg_path, "JPEG", quality=80)
            print(f"Converted and resized {og_path} -> {jpg_path}")

    # 3. compress blog IKE image
    ike_path = os.path.join(img_dir, "blog-ike-obligacje-pko-bp.webp")
    if os.path.exists(ike_path):
        with Image.open(ike_path) as im:
            # Scale down to 800x800
            im.thumbnail((800, 800), Image.Resampling.LANCZOS)
            im.save(ike_path, "WEBP", quality=70, method=6)
            print(f"Compressed {ike_path}")

    # 4. Scale down all thumb_*.webp to 640x640 max
    thumbs = glob.glob(os.path.join(img_dir, "thumb_*.webp"))
    for thumb in thumbs:
        with Image.open(thumb) as im:
            if im.width > 640 or im.height > 640:
                im.thumbnail((640, 640), Image.Resampling.LANCZOS)
                im.save(thumb, "WEBP", quality=80)
                print(f"Resized {thumb}")

if __name__ == '__main__':
    optimize_images()
