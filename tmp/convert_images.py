from PIL import Image
import os

files = [
    (r"C:\Users\komptest\.gemini\antigravity\brain\146d30b1-0868-4450-bdd9-d24c26841644\ikze_2026_thumbnail_1775411425788.png", 
     r"c:\Users\komptest\Documents\ETFkalkulator 3.0\A wersja do pracy\images\ikze-2026-porownanie-brokerow.webp"),
    (r"C:\Users\komptest\.gemini\antigravity\brain\146d30b1-0868-4450-bdd9-d24c26841644\bonds_profit_thumbnail_1775411636575.png", 
     r"c:\Users\komptest\Documents\ETFkalkulator 3.0\A wersja do pracy\images\kalkulator-obligacji-zysk.webp")
]

for src, dst in files:
    if os.path.exists(src):
        img = Image.open(src)
        # Convert to RGB if needed (though PNG usually is)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(dst, "WEBP", quality=90)
        print(f"Converted {src} to {dst}")
    else:
        print(f"Source not found: {src}")
