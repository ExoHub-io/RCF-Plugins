// Modules
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// VARS
const pageFileName = 'lucideExample.html';
const pagesFolder = 'structure/pages/';


const pluginsFolder = 'RocketFramework/plugins/';
const pluginsFileName = 'lucide_support.js';
const pluginsName = 'LucideSupport';
const pluginsGitPath = 'https://raw.githubusercontent.com/ExoHub-io/RCF-Plugins/refs/heads/main/plugins/lucide_support/';

// Async wrapper
(async () => {
    // Greetings
    console.log('Starting installing : ' + pluginsName);

    // Installation check
    if (fs.existsSync(path.join(pluginsFolder, pluginsFileName))) {
        console.log(pluginsFileName + ' : Already installed!');
        console.log('If you want to update! Delete ' + pluginsFileName);
    } else {
        console.log(pluginsFileName + ' : Not installed!');
        console.log(pluginsFileName + ' : Starting installation');

        try {
            // plugin code
            const resp = await axios.get(pluginsGitPath + pluginsFileName, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                }
            });

            let content = resp.data;

            // ✅ Extract text between <pre>...</pre> if it exists
            const match = content.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
            if (match) {
                content = match[1]; // Only the content inside <pre>
            }

            // Write to file
            fs.writeFileSync(path.join(pluginsFolder, pluginsFileName), content);

            // examples
            const respExample = await axios.get(pluginsGitPath + pageFileName, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
                }
            });

            let contentExample = respExample.data;

            // ✅ Extract text between <pre>...</pre> if it exists
            const matchExample = contentExample.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
            if (matchExample) {
                contentExample = matchExample[1]; // Only the content inside <pre>
            }

            // Write to file
            fs.writeFileSync(path.join(pagesFolder, pageFileName), contentExample);
            // end
            console.log(pluginsFileName + ' : Installed successfully!');
        } catch (error) {
            console.error('Error downloading or writing plugin:', error.message);
        }
    }
})();