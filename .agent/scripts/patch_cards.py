import os
import re

files_to_patch = ['pages/kalkulator-wolnosci.html', 'pages/porownywarka.html']

for f_path in files_to_patch:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace cursor-help with cursor-pointer
    content = content.replace('cursor-help', 'cursor-pointer')
    # Replace hover:scale-[1.01] and hover:scale-[1.02] with hover:scale-105
    content = content.replace('hover:scale-[1.01]', 'hover:scale-105')
    content = content.replace('hover:scale-[1.02]', 'hover:scale-105')
    
    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
js_path = 'js/porownywarka.js'
if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()
    
    # We want to patch rysujTabele where tr is created
    target = """    var tr = document.createElement('tr');
    tr.className = 'hover:bg-stitch-bg/50 transition-colors';"""
    
    replacement = """    var tr = document.createElement('tr');
    tr.className = 'hover:bg-stitch-bg/50 transition-colors cursor-pointer hover:scale-[1.01] group';
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("role", "button");
    tr.onclick = function(e) { if(window.openEduModal) window.openEduModal('por_zwyciezca', e); };
    tr.onkeydown = function(e) { if(e.key === 'Enter') this.click(); };"""
    
    if target in js:
        js = js.replace(target, replacement)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js)
        print("Patched porownywarka.js")
    else:
        print("Target not found in porownywarka.js")
