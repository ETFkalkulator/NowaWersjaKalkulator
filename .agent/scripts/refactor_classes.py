import os
import re

html_files = []
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html') and 'temp' not in f:
            html_files.append(os.path.join(root, f))

tailwind_script_pattern = re.compile(r'<script\s+id="tailwind-config"[\s\S]*?</script>')

def refactor_classes(content):
    # 1. Colors & Backgrounds (combining light and dark)
    # Using regex to match both regardless of order, inside class="..." attributes
    def replacer(match):
        cls_str = match.group(1)
        
        # Backgrounds
        cls_str = re.sub(r'\bbg-white\b', 'bg-stitch-surface', cls_str)
        cls_str = re.sub(r'\bbg-slate-50\b', 'bg-stitch-bg', cls_str)
        cls_str = re.sub(r'\bdark:bg-slate-[89]00\b', '', cls_str)
        
        # Texts
        cls_str = re.sub(r'\btext-slate-[89]00\b', 'text-stitch-text', cls_str)
        cls_str = re.sub(r'\bdark:text-white\b', '', cls_str)
        cls_str = re.sub(r'\bdark:text-slate-200\b', '', cls_str)
        cls_str = re.sub(r'\btext-slate-500\b', 'text-stitch-muted', cls_str)
        cls_str = re.sub(r'\bdark:text-slate-400\b', '', cls_str)
        
        # Borders
        cls_str = re.sub(r'\bborder-slate-200\b', 'border-stitch-border', cls_str)
        cls_str = re.sub(r'\bdark:border-slate-[78]00\b', '', cls_str)
        
        # Shadows
        cls_str = re.sub(r'\bshadow-(sm|md|lg|xl|2xl)\b', 'shadow-stitch-soft', cls_str)
        
        # Rounded corners
        cls_str = re.sub(r'\brounded-(3xl|2xl|xl|lg)\b', 'rounded-stitch', cls_str)
        
        # Clean up multiple spaces
        cls_str = re.sub(r'\s+', ' ', cls_str).strip()
        
        return f'class="{cls_str}"'

    return re.sub(r'class="([^"]+)"', replacer, content)

for f_path in html_files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    depth = f_path.count(os.sep)
    if f_path.startswith('.\\') or f_path.startswith('./'):
        depth -= 1
        
    rel_path = '../' * depth + 'js/tailwind-config.js'
    if depth == 0:
        rel_path = 'js/tailwind-config.js'

    new_content = tailwind_script_pattern.sub(f'<script src="{rel_path}"></script>', content)
    new_content = refactor_classes(new_content)
    
    if new_content != content:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {f_path}")
