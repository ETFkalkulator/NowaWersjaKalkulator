from PIL import Image
import os

source = r"C:\Users\komptest\.gemini\antigravity\brain\405798ad-877d-4f44-bdaa-e04088048806\tfi_vs_etf_thumbnail_asset_1775918619481.png"
target = r"c:\Users\komptest\Documents\ETFkalkulator 3.0\A wersja do pracy\images\tfi-vs-etf-porownanie-2026.webp"

with Image.open(source) as im:
    width, height = im.size
    print(f"Original size: {width}x{height}")
    
    # Target ratio 16:9
    target_ratio = 16/9
    current_ratio = width/height
    
    if current_ratio > target_ratio:
        # Too wide, crop width
        new_width = height * target_ratio
        offset = (width - new_width) / 2
        im = im.crop((offset, 0, width - offset, height))
    elif current_ratio < target_ratio:
        # Too tall
        new_height = width / target_ratio
        offset = (height - new_height) / 2
        im = im.crop((0, offset, width, height - offset))
    
    print(f"New size: {im.size}")
    im.save(target, "WEBP", quality=85, method=6)
    print(f"Saved to {target}")
