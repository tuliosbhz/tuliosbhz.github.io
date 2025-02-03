const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        // Clean dist directory
        await fs.remove('dist');
        await fs.ensureDir('dist');

        // Copy all files from src to dist
        await fs.copy('src', 'dist/src');
        
        // Copy index.html to dist
        await fs.copy('index.html', 'dist/index.html');

        // Copy scripts directly to make paths work
        await fs.copy('src/scripts', 'dist/scripts');

        // Handle HTML files
        const files = [
            'dist/index.html',
            'dist/src/blog/charger-tutorial.html'
        ];

        for (const file of files) {
            if (await fs.pathExists(file)) {
                let content = await fs.readFile(file, 'utf8');
                
                // Replace development paths with production paths
                content = content.replace(/\/src\//g, '/');
                
                await fs.writeFile(file, content);
            } else {
                console.warn(`Warning: File not found: ${file}`);
            }
        }

        // Create .nojekyll file for GitHub Pages
        await fs.writeFile('dist/.nojekyll', '');

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build(); 