const fs = require('fs');
const path = require('path');

const inputFile = 'game.html';
const outputFile = 'assets/game_bundled.js';

if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

let html = fs.readFileSync(inputFile, 'utf8');

// Inline CSS
console.log('Inlining CSS...');
const cssRegex = /<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>/g;
html = html.replace(cssRegex, (match, href) => {
    if (href.startsWith('http') || href.startsWith('//')) return match;
    try {
        const css = fs.readFileSync(href, 'utf8');
        // Escape backslashes in CSS to prevent JS template literal issues
        const safeCss = css.replace(/\\/g, '\\\\');
        return `<style>/* ${href} */\n${safeCss}\n</style>`;
    } catch (e) {
        console.warn(`Failed to inline CSS ${href}: ${e.message}`);
        return match;
    }
});

// Inline JS
console.log('Inlining JS...');

// Regex to capture the full opening tag (group 1) and the src attribute (group 2)
// This allows us to reconstruct external script tags with all their original attributes (async, defer, etc.)
const scriptRegex = /(<script\s+[^>]*src="([^"]+)"[^>]*>)\s*<\/script>/gi;

html = html.replace(scriptRegex, (match, openTag, src) => {
    // Check if it's an external script
    if (src.startsWith('http') || src.startsWith('//')) {
        console.log(`- Keeping external script: ${src}`);
        // Return original tag (including attributes like async) + closing tag
        return `${openTag}<\/script>`;
    }

    // It's a local script, try to inline it
    try {
        console.log(`- Inlining: ${src}`);
        let js = fs.readFileSync(src, 'utf8');

        // Safety: Escape closing script tags inside JS string literals to prevent HTML breakage
        js = js.replace(/<\/script>/gi, '<\\/script>');

        return `<script type="text/javascript">/* ${src} */\n${js}\n</script>`;
    } catch (e) {
        console.warn(`- Failed to inline ${src}: ${e.message}`);
        return match; // Keep original if failed
    }
});

console.log('Finalizing bundle...');

// Escape for JS template literal
// 1. Double backslashes (so \n becomes \\n)
// 2. Escape backticks
// 3. Escape ${ (template placeholders)
const escapedHtml = html
    .split('\\').join('\\\\')
    .split('`').join('\\`')
    .split('${').join('\\${');

const jsContent = `export default \`${escapedHtml}\`;`;

fs.writeFileSync(outputFile, jsContent);
const stats = fs.statSync(outputFile);
console.log(`Successfully bundled!`);
console.log(`Path: ${outputFile}`);
console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
