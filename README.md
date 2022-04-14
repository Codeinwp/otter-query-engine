# Otter Tool Testing - Query Engine
> It allows you to import blocks exported in JSON file from GitHub.

## Getting Started

[Optional] Fork [this repo](https://github.com/Codeinwp/otter-blocks-qa-templates). Make a folder, and add some exported blocks in it.

## Load the Query Engine in your browser.
Methods:
1. Load the `dist/index.js` as js file in the page. See `index.html`
```html
 <script type="module" defer src="https://cdn.jsdelivr.net/gh/Soare-Robert-Daniel/otter-query-engine@master/dist/index.js"></script>
```
2. Inject the script via js and CDN link. *You also use [Snippets](https://developer.chrome.com/docs/devtools/javascript/snippets/).*
```javascript
window.addEventListener('load', (event) => {
    let count = 0;
    const interv = setInterval( () => {
        count ++;
        const settingsBar = document.querySelector("#editor div.edit-post-header__settings")
        if( settingsBar ) {
            var s = document.createElement('script');
            s.defer = true;
            s.type = "module";
            s.src = "https://cdn.jsdelivr.net/gh/Codeinwp/otter-query-engine@master/dist/index.js";
            (document.head||document.documentElement).appendChild(s);
            clearInterval(interv);
        }
        if(count > 6) {
            clearInterval(interv);
        }
    }, 500);
});
```

**You can also use the Chrome extension. [Link](https://github.com/Codeinwp/otter-blocks-qa-templates)**

## Usage

Insert all the files from the `blocks` folder.
```javascript
new QueryQA().select('blocks').run()
```

Insert all the files from the `blocks` folder in Robert's repo.
```javascript
new QueryQA().select('blocks').from('robert').run()
```

Insert all the files from the `blocks` folder in Robert's repo and specify the repo **(RAW content only)**.
```javascript
new QueryQA().select('blocks').from('robert', 'https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/').run()
```

Insert all the files from the `blocks` folder which have the names `summer-breeze` and `countdown`.
```javascript
new QueryQA().select('blocks').where({ names: ['summer-breeze', 'countdown'] }).run()
```

Insert all the files from the `blocks` folder which have ONLY the `flip` block.
```javascript
new QueryQA().select('blocks').where({ has: { blocks: ['flip'] }}).run()
```

**[Short Syntax]** Insert all the files from the `blocks` folder which have ONLY the `flip` block.
```javascript
new QueryQA().select('blocks').where({ has: ['flip'] }).run()
```

Insert all the files from the `blocks` folder which CONTAINS the `flip` block.
```javascript
new QueryQA().select('blocks').where({ has: ['flip'], mode: 'all' }).run()
```

Insert all the files from the `blocks` folder which have ONLY the `count` plugin.
```javascript
new QueryQA().select('blocks').where({ has: { plugins: ['count'] } }).run()
```

**[Short Syntax]** Insert all the files from the `blocks` folder which have ONLY the `count` plugin.
```javascript
new QueryQA().select('blocks').where({ has: ['count'] }).run()
```

Insert all the files from the `blocks` folder which CONTAINS the `count` plugin.
```javascript
new QueryQA().select('blocks').where({ has: { plugins: ['count'] }, mode: 'all' }).run()
```

Insert the first 5 files from the `blocks` folder.
```javascript
new QueryQA().select('blocks').take(5).run()
```

Shuffle the files from the `blocks` folder then insert the first 5 files .
```javascript
new QueryQA().select('blocks').take(5, {shuffle: true}).run()
```

Shuffle the files which CONTAINS the `flip` block from the `blocks` folder then insert the first file .
```javascript
new QueryQA().select('blocks').where({ has: ['flip'], mode: 'all' }).take(5, {shuffle: true}).run()
```
