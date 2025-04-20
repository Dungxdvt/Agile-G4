// Add cart.js, product.js and cart-drawer.js scripts to all HTML files
const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory and subdirectories
function getHtmlFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    }

    return results;
}

// Add scripts to HTML file
function addScripts(htmlFile) {
    let content = fs.readFileSync(htmlFile, 'utf8');

    // Remove existing scripts if they exist
    content = content.replace(/<script src="js\/cart\.js"><\/script>/g, '');
    content = content.replace(/<script src="js\/product\.js"><\/script>/g, '');
    content = content.replace(/<script src="js\/cart-drawer\.js"><\/script>/g, '');

    // Find the position to insert scripts (before theme.js)
    const themeScriptIndex = content.lastIndexOf('<script src="js/theme.js"></script>');
    if (themeScriptIndex === -1) {
        console.log(`No theme.js script found in ${htmlFile}`);
        return;
    }

    // Insert scripts before theme.js
    const scripts = '<script src="js/cart.js"></script>\n  <script src="js/product.js"></script>\n  <script src="js/cart-drawer.js"></script>\n  ';
    content = content.slice(0, themeScriptIndex) + scripts + content.slice(themeScriptIndex);

    // Write back to file
    fs.writeFileSync(htmlFile, content);
    console.log(`Added scripts to ${htmlFile}`);
}

// Main execution
const htmlFiles = getHtmlFiles('.');
for (const file of htmlFiles) {
    addScripts(file);
} 