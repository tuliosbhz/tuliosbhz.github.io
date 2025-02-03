const fs = require('fs-extra');
const path = require('path');

async function build() {
    // Clean dist directory
    await fs.remove('dist');
    await fs.ensureDir('dist');

    // Copy all files from src to dist
    await fs.copy('src', 'dist');
    
    // Copy index.html to dist
    await fs.copy('index.html', 'dist/index.html');

    // Read and modify paths in HTML files for production
    const files = [
        'dist/index.html',
        'dist/blog/charger-tutorial.html'
    ];

    for (const file of files) {
        let content = await fs.readFile(file, 'utf8');
        
        // Replace development paths with production paths
        content = content.replace(/\/src\//g, '/');
        
        await fs.writeFile(file, content);
    }

    // Create .nojekyll file for GitHub Pages
    await fs.writeFile('dist/.nojekyll', '');

    console.log('Build completed successfully!');
}

build().catch(console.error); 