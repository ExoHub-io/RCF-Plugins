// plugins/mkFast.js

// Модули
const { customElementsLoader } = require('../../RocketFramework/Celems.js');
const { chvarsLoader } = require('../../RocketFramework/Chvars.js');
const fs_promise = require('fs').promises;
const path = require('path');

const folderCache = path.join(__dirname, 'cache');

const methodTypes = {
    store: 'store',
    remove: 'remove',
    get: 'get'
};

function success() {
    console.warn('MakeFaster loaded!');
    console.warn(`
MakeFaster greeting

// ===============Lucide support (Integrated)====================
// write in the head of .html: '-lucide-'
// when you want: <i data-lucide="icon_name"></i>
// > https://lucide.dev/icons/

MakeFaster greeting ended
`);
}

let page_code = `
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lucide Example</title>

    -lucide- <!-- Now this document supports lucide -->

    <style>
        body {
            background-color: #090b14;
            color: white;
            margin: 0;
            font-family: sans-serif;
        }
        #text {
            align-items: center;
            display: flex;
            gap: 10px;
            padding: 20px;
        }
        h1 {
            font-size: 60px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div id="text">
        <i style="width: 50px; height: 50px;" data-lucide="camera"></i>
        <i style="width: 50px; height: 50px;" data-lucide="check"></i>
        <i style="width: 50px; height: 50px;" data-lucide="monitor"></i>
        <i style="width: 50px; height: 50px;" data-lucide="monitor-check"></i>
        <h1>Lucide Example</h1>
    </div>
    <h1 style="padding-left: 20px;">Icons below</h1><br/>
    <i style="width: 200px; height: 200px; margin: 0 10px;" data-lucide="monitor-check"></i>
    <i style="width: 200px; height: 200px; margin: 0 10px;" data-lucide="camera"></i>
    <i style="width: 200px; height: 200px; margin: 0 10px;" data-lucide="check"></i>
    <i style="width: 200px; height: 200px; margin: 0 10px;" data-lucide="monitor"></i>
</body>
</html>`;

function luciding(page_content) {
    return page_content.replace(
        '-lucide-',
        `
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
  });
</script>
`
    );
}

// Инициализация папки кэша с рекурсивным созданием
async function cache_init() {
    try {
        await fs_promise.mkdir(folderCache, { recursive: true });
    } catch (err) {
        console.error('Error creating cache folder:', err);
    }
}

// Проверка существования файла
async function fileExists(filePath) {
    try {
        await fs_promise.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Универсальная функция работы с кэшем
 * @param {string} method_ - метод: 'store', 'get', 'remove'
 * @param {string|null} content - содержимое для записи (для store)
 * @param {string} fileName - имя файла в кэше
 * @returns {Promise<string|boolean|null>} - содержимое (для get) или true/false для других методов
 */
async function cache(method_, content, fileName) {
    const cachePath = path.join(folderCache, fileName);

    if (method_ === methodTypes.store) {
        // Перед записью проверяем, есть ли уже такой же контент в файле
        if (await fileExists(cachePath)) {
            const existingContent = await fs_promise.readFile(cachePath, 'utf8');
            if (existingContent === content) {
                // Контент тот же, запись не нужна
                return true;
            }
        }
        await fs_promise.writeFile(cachePath, content, 'utf8');
        return true;
    }

    if (method_ === methodTypes.get) {
        if (await fileExists(cachePath)) {
            return await fs_promise.readFile(cachePath, 'utf8');
        }
        return null;
    }

    if (method_ === methodTypes.remove) {
        if (await fileExists(cachePath)) {
            await fs_promise.unlink(cachePath);
            console.log('File deleted:', cachePath);
            return true;
        }
        return false;
    }

    throw new Error(`Unknown cache method: ${method_}`);
}

function mkfastRender(content, res, lucide_support = false) {
    if (lucide_support) {
        content = luciding(content);
    }
    res.send(content);
}

function logic(app) {
    cache_init();

    app.get('/plugins/mkFast/page/example/MakeFaster', async (req, res) => {
        try {
            await cache(methodTypes.store, page_code, 'page_cache.html');
            const cache_value = await cache(methodTypes.get, null, 'page_cache.html');

            if (cache_value === null) {
                return res.status(404).send('Cache file not found');
            }

            mkfastRender(cache_value, res, true);
        } catch (error) {
            console.error('Error in /plugins/lucide/page/example/MakeFaster:', error);
            res.status(500).send('Internal Server Error');
        }
    });
}

module.exports = function (context) {
    const app = context.router;

    success();

    logic(app);
};
