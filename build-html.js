const fs = require('fs');
const path = require('path');

const inputFile = 'game.html';
const outputFile = 'dist/game_bundled.js';

// Ensure dist dir exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

let html = fs.readFileSync(inputFile, 'utf8');

// Inline CSS
html = html.replace(/<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>/g, (match, href) => {
    if (href.startsWith('http') || href.startsWith('//')) return match;
    try {
        console.log(`Inlining CSS: ${href}`);
        const css = fs.readFileSync(href, 'utf8');
        return `<style>${css}</style>`;
    } catch (e) {
        console.warn(`Failed to inline CSS ${href}: ${e.message}`);
        return match;
    }
});

// Inline JS
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith('//')) return match;
    try {
        console.log(`Inlining JS: ${src}`);
        const js = fs.readFileSync(src, 'utf8');
        return `<script>${js}</script>`;
    } catch (e) {
        console.warn(`Failed to inline JS ${src}: ${e.message}`);
        return match;
    }
});

// Escape for JS template literal
// 1. Double backslashes (so \n becomes \\n)
// 2. Escape backticks
// 3. Escape ${ (template placeholders)
const escapedHtml = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

const jsContent = `export default \`${escapedHtml}\`;`;

fs.writeFileSync(outputFile, jsContent);
console.log(`Successfully bundled to ${outputFile}`);
