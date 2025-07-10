// plugins/lucide_support.js

// Модули
const { customElementsLoader } = require('../../RocketFramework/Celems.js');
const { chvarsLoader } = require('../../RocketFramework/Chvars.js');
const fs = require('fs');
const path = require('path');

function success() {
    console.warn('Lucide Support loaded!');
    console.warn(`
Lucide greeting

// To use icons in html
// write in the head of .html: '-lucide-'
// render .html through 'render_with_lucide_support()'
// https://lucide.dev/icons/
// and when you want: <i data-lucide="icon_name"></i>
// like: '<i data-lucide="camera"></i>'

Lucide greeting ended
`);
}

function luciding(page_content) {
    ret = page_content.replace('-lucide-', `
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
  })
</script>
`);

    return ret
}

function render_with_lucide_support(path_, res) {
    const pagePath = path.join(__dirname, '..', '..', 'structure', 'pages', path_);

    fs.readFile(pagePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файла');
        }

        let page_content = data;
        page_content = chvarsLoader(page_content);
        page_content = customElementsLoader(page_content);
        page_content = luciding(page_content);

        res.send(page_content);
    });
}

function logic(app) {
    // lucidePluginSettings.html


    // To use icons in html
    // write in the head: -lucide-
    // https://lucide.dev/icons/
    // and when you want: <i data-lucide="icon_name"></i>
    // like: <i data-lucide="camera"></i>


    // Example of handling only "get" requests
    app.get('/plugins/lucide/page/main', (req, res) => {
        render_with_lucide_support('lucideExample.html', res); // Here we are rendering page from structure/pages
    });
}

module.exports = function (context) {
    const app = context.router;

    success();

    logic(app);
}
