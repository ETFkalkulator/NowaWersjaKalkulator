const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      const tailwindRegex = /([ \t]*)<link[^>]+href="[^"]*css\/tailwind\.css"[^>]*>[\r\n]*/i;
      const match = tailwindRegex.exec(content);
      
      if (match) {
        let cleanedContent = content.replace(tailwindRegex, '');
        
        let tailwindLink = fullPath.includes(path.sep + 'pages' + path.sep) || fullPath.includes(path.sep + 'blog' + path.sep) ? 
            `<link rel="stylesheet" href="../css/tailwind.css">` : 
            `<link rel="stylesheet" href="css/tailwind.css">`;

        // If it's 404.html which is in root
        if(file === '404.html') {
             tailwindLink = `<link rel="stylesheet" href="css/tailwind.css">`;
        }

        const mainCssRegex = /([ \t]*(?:<link[^>]+href="[^"]*css\/main\.css"[^>]*>|rel="stylesheet"[^\n]*css\/main\.css[^\n]*>)[\r\n]*)/i;
        if (mainCssRegex.test(cleanedContent)) {
            cleanedContent = cleanedContent.replace(mainCssRegex, `$1${match[1] || '  '}${tailwindLink}\n`);
            fs.writeFileSync(fullPath, cleanedContent, 'utf-8');
            console.log(`Updated ${fullPath}`);
        } else {
            console.log(`Could not find main.css in ${fullPath}`);
        }
      }
    }
  }
}

processDir(__dirname);
