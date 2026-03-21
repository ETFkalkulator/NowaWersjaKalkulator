import os
import re

for root, _, files in os.walk('.'):
    for f in files:
        if f.endswith('.html') and 'temp_' not in f:
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            
            def fix_onclick(m):
                tag = m.group(0)
                if 'onkeydown' not in tag:
                    return tag.replace('onclick', 'onkeydown="if(event.key===\'Enter\')this.click()" onclick')
                return tag
            
            content = re.sub(r'<(div|span|a|li|button)[^>]+onclick="[^"]+"[^>]*>', fix_onclick, content)
            
            with open(p, 'w', encoding='utf-8') as file:
                file.write(content)
