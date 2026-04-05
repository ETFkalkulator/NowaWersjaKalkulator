import os
import re

def clean_css_links():
    html_files = []
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root or '.claude' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    # Regex to match the link tags defensively:
    pattern_reset = re.compile(r'^\s*<link rel="stylesheet" href="[^"]*css/reset\.css"[^>]*>\r?\n', re.MULTILINE | re.IGNORECASE)
    pattern_vars = re.compile(r'^\s*<link rel="stylesheet" href="[^"]*css/variables\.css"[^>]*>\r?\n', re.MULTILINE | re.IGNORECASE)
    pattern_main = re.compile(r'^\s*<link rel="stylesheet" href="[^"]*css/main\.css"[^>]*>\r?\n', re.MULTILINE | re.IGNORECASE)
    
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove old CSS links completely
        new_content = pattern_reset.sub('', content)
        new_content = pattern_vars.sub('', new_content)
        new_content = pattern_main.sub('', new_content)

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned {file_path}")

if __name__ == '__main__':
    clean_css_links()
