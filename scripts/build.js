const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        // Clean dist directory
        await fs.remove('dist');
        await fs.ensureDir('dist');

        // Copy all files from src to dist with correct structure
        await fs.copy('src', 'dist');
        
        // Copy index.html to root of dist
        await fs.copy('index.html', 'dist/index.html');

        // Update file paths in HTML files
        const files = [
            'dist/index.html',
            'dist/blog/charger-tutorial.html'
        ];

        for (const file of files) {
            if (await fs.pathExists(file)) {
                let content = await fs.readFile(file, 'utf8');
                
                // Replace all /src/ references with /
                content = content.replace(/\/src\//g, '/');
                
                await fs.writeFile(file, content);
            } else {
                console.warn(`Warning: File not found: ${file}`);
            }
        }

        // Update paths in JavaScript files
        const jsFiles = [
            'dist/scripts/main.js',
            'dist/scripts/blog/charger-game.js'
        ];

        for (const file of jsFiles) {
            if (await fs.pathExists(file)) {
                let content = await fs.readFile(file, 'utf8');
                content = content.replace(/\/src\//g, '/');
                await fs.writeFile(file, content);
            }
        }

        // Create .nojekyll file
        await fs.writeFile('dist/.nojekyll', '');

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build(); 