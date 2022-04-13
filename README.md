# Otter Tool Testing - Query Engine
> It allows you to import blocks exported in JSON file from GitHub.

## Getting Started

Create repo or fork [this](https://github.com/Soare-Robert-Daniel/otter-blocks-qa-templates). Make a folder, and add some exported blocks in it.

#### Load the Query Engine in your browser.
Methods:
1. Go to `dist/index.js`, copy the code without the `export default QueryQA;` line, then paste it in to the browser Console.
2. Load the `dist/index.js` as js file in the page. See `index.html`
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/Soare-Robert-Daniel/otter-query-engine@master/dist/index.js"></script>
```
3. Inject the script via js and CDN link. *You also use [Snippets](https://developer.chrome.com/docs/devtools/javascript/snippets/).*
```javascript
var s = document.createElement('script');
s.type = "module";
s.src = "https://cdn.jsdelivr.net/gh/Soare-Robert-Daniel/otter-query-engine@master/dist/index.js";
(document.head||document.documentElement).appendChild(s);
```

#### Usage

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
