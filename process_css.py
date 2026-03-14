import re

def process_css():
    with open('css/main.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the dark mode block
    match = re.search(r'(@media \(prefers-color-scheme: dark\) \{)(.*?)^\}', content, re.MULTILINE | re.DOTALL)
    if not match:
        print("Block not found")
        return
        
    media_header = match.group(1)
    inner_css = match.group(2)
    
    # Function to prepend prefix to selectors in the inner CSS
    def prepend_selectors(css_text, prefix):
        lines = css_text.split('\n')
        out_lines = []
        is_selector_context = True
        
        for line in lines:
            stripped = line.strip()
            # If it's empty, a comment, or inside a rule
            if not stripped or stripped.startswith('/*'):
                out_lines.append(line)
                continue
            
            if '{' in line:
                # Process the part before {
                parts = line.split('{')
                selectors_part = parts[0]
                rest = '{' + '{'.join(parts[1:])
                
                # Split by comma to handle multiple selectors
                selectors = selectors_part.split(',')
                new_selectors = []
                for s in selectors:
                    s_stripped = s.strip()
                    if s_stripped:
                        # Find leading whitespace
                        ws_match = re.match(r'^(\s*)', s)
                        ws = ws_match.group(1) if ws_match else ''
                        if s_stripped == 'body':
                            new_selectors.append(f"{ws}{prefix} {s_stripped}")
                        else:
                            new_selectors.append(f"{ws}{prefix} {s_stripped}")
                    else:
                        new_selectors.append(s)
                
                out_lines.append(','.join(new_selectors) + ' ' + rest)
                is_selector_context = False
                continue
            
            if '}' in line:
                is_selector_context = True
                out_lines.append(line)
                continue
                
            if is_selector_context:
                # Multi-line selector split by comma
                if line.endswith(','):
                    s_stripped = line[:-1].strip()
                    ws_match = re.match(r'^(\s*)', line)
                    ws = ws_match.group(1) if ws_match else ''
                    out_lines.append(f"{ws}{prefix} {s_stripped},")
                else:
                    out_lines.append(line)
            else:
                out_lines.append(line)
                
        return '\n'.join(out_lines)

    # 1. System media query with overrides blocked when light-mode
    modified_media_inner = prepend_selectors(inner_css, 'html:not(.light-mode)')
    block1 = f"/* SYSTEM DARK MODE (z wyłączeniem wymuszonego light) */\n{media_header}{modified_media_inner}\n}}"
    
    # 2. Manual class dark mode
    block2 = f"/* MANUAL DARK MODE CLASS */\n{prepend_selectors(inner_css, 'html.dark-mode').strip()}"
    
    # Replace in file
    new_content = content[:match.start()] + block1 + "\n\n" + block2 + "\n" + content[match.end():]
    
    with open('css/main.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("CSS overwritten!")

if __name__ == '__main__':
    process_css()
