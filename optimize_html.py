import os
import re

def defer_scripts():
    html_files = []
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root or '.claude' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    pat_nav = re.compile(r'<script\s+src="([^"]*?)js/nav\.js"\s*></script>', re.IGNORECASE)
    pat_ml = re.compile(r'<script\s+src="(https://groot\.mailerlite\.com/[^"]+)"\s*></script>', re.IGNORECASE)
    pat_og = re.compile(r'content="https://etfkalkulator\.pl/images/og-image\.png"', re.IGNORECASE)
    pat_hero = re.compile(r'images/hero-bg-new\.png', re.IGNORECASE)
    
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Avoid double defer
        if 'defer src=' not in content and 'defer' not in content[content.find('js/nav.js')-15:content.find('js/nav.js')+15]:
            new_content = pat_nav.sub(r'<script defer src="\1js/nav.js"></script>', content)
        else:
            new_content = pat_nav.sub(r'<script defer src="\1js/nav.js"></script>', content) # Simplification: Just regex matching exactly without defer
            
        new_content = pat_ml.sub(r'<script defer src="\1"></script>', new_content)
        new_content = pat_og.sub(r'content="https://etfkalkulator.pl/images/og-image.jpg"', new_content)
        new_content = pat_hero.sub(r'images/hero-bg-new.webp', new_content)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")

    # Process main.css for hero-bg-new.png logic
    css_path = 'css/main.css'
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        new_css = pat_hero.sub(r'images/hero-bg-new.webp', css_content)
        if new_css != css_content:
            with open(css_path, 'w', encoding='utf-8') as f:
                f.write(new_css)
            print("Updated main.css")

if __name__ == '__main__':
    defer_scripts()
