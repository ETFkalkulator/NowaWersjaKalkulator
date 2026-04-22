const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
let filesChecked = 0;
let brokenLinks = [];
let totalLinks = 0;

function checkFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    filesChecked++;
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /(?:href|src)=["']([^"']+)["']/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        let link = match[1];
        if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('#') || link.startsWith('tel:')) continue;
        
        // Remove query params and hashes
        link = link.split('?')[0].split('#')[0];
        if (!link) continue;
        
        totalLinks++;
        let targetPath;
        if (link.startsWith('/')) {
            targetPath = path.join(rootDir, link.substring(1));
        } else {
            targetPath = path.join(path.dirname(filePath), link);
        }
        
        if (!fs.existsSync(targetPath)) {
            brokenLinks.push(`Błąd 404 w pliku ${path.relative(rootDir, filePath)}: brakuje pliku -> ${link}`);
        }
    }
}

function traverseDir(dir) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') traverseDir(fullPath);
        } else {
            checkFile(fullPath);
        }
    }
}

console.log("Rozpoczynam Ostateczny Audyt Linków i Zasobów...");
traverseDir(rootDir);

console.log(`\nPrzeskanowano: ${filesChecked} plików HTML.`);
console.log(`Przeanalizowano lokalnych odnośników: ${totalLinks}`);

if (brokenLinks.length > 0) {
    console.log(`\n❌ ZNALEZIONO BŁĘDY W LINKOWANIU (${brokenLinks.length}):`);
    brokenLinks.forEach(b => console.log(b));
} else {
    console.log("\n✅ WSZYSTKIE LOKALNE ZASOBY (SKRYPTY, STYLE, ZDJĘCIA, STRONY) SĄ POŁĄCZONE PRAWIDŁOWO! 0 błędów 404.");
}
