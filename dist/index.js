/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst compare_versions_1 = __webpack_require__(/*! compare-versions */ \"./node_modules/compare-versions/index.mjs\");\nclass QueryQA {\n    sources;\n    source;\n    folder;\n    query;\n    maxResults;\n    takeQuery;\n    constructor() {\n        this.sources = {\n            \"robert\": \"https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/\"\n        };\n        this.folder = \"blocks\";\n        this.source = \"robert\";\n    }\n    select(folder) {\n        this.folder = folder;\n        return this;\n    }\n    where(query) {\n        this.query = query;\n        return this;\n    }\n    from(source, url) {\n        this.source = source;\n        if (url) {\n            this.sources[this.source] = url;\n        }\n        return this;\n    }\n    take(maxResults, options) {\n        this.maxResults = maxResults;\n        this.takeQuery = options;\n        return this;\n    }\n    async build() {\n        if (this.source === undefined) {\n            console.warn(\"The source is undefined! Use '.from()' function to set a source.\");\n            return;\n        }\n        if (this.folder === undefined) {\n            console.warn(\"The folder is undefined! Use '.select()' function to set a folder.\");\n            return;\n        }\n        const mainPath = `${this.sources[this.source]}/${this.folder}`;\n        const respIndex = await fetch(`${mainPath}/index.json`, {\n            method: 'GET',\n            headers: {\n                'Accept': 'application/json'\n            }\n        });\n        if (!respIndex.ok) {\n            console.warn('The repo does not exists!');\n            return;\n        }\n        const index = await respIndex.json();\n        let validFiles = index?.files?.filter(file => {\n            if (this.query === undefined) {\n                return true;\n            }\n            if (this.query?.names?.includes(file.name)) {\n                return true;\n            }\n            let valid = true;\n            if (this.query.mode === undefined || this.query.mode === \"exclusive\") {\n                if (Array.isArray(this.query?.has)) {\n                    valid = [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.every(blockSlug => this.query?.has?.includes(blockSlug));\n                }\n                else {\n                    if (this.query?.has?.blocks !== undefined && file?.has?.blocks?.every(blockSlug => this.query?.has?.blocks?.includes(blockSlug))) {\n                        valid = true;\n                    }\n                    if (this.query?.has?.plugins !== undefined && file?.has?.plugins?.every(pluginSlug => this.query?.has?.plugins?.includes(pluginSlug))) {\n                        valid = true;\n                    }\n                }\n            }\n            else {\n                if (Array.isArray(this.query?.has)) {\n                    valid = [...(file?.has?.blocks || []), ...(file?.has?.plugins || [])]?.some(blockSlug => this.query?.has?.includes(blockSlug));\n                }\n                else {\n                    if (this.query?.has?.blocks !== undefined && file?.has?.blocks?.some(blockSlug => this.query?.has?.blocks?.includes(blockSlug))) {\n                        valid = true;\n                    }\n                    if (this.query?.has?.plugins !== undefined && file?.has?.plugins?.some(pluginSlug => this.query?.has?.plugins?.includes(pluginSlug))) {\n                        valid = true;\n                    }\n                }\n            }\n            if (this.query?.tags) {\n                if (this.query.mode === undefined || this.query.mode === \"exclusive\") {\n                    valid = valid && Boolean(file?.tags?.every(blockTag => this.query?.tags?.includes(blockTag)));\n                }\n                else {\n                    valid = valid && Boolean(file?.tags?.some(blockTags => this.query?.tags?.includes(blockTags)));\n                }\n            }\n            if (this.query?.version) {\n                valid = valid && (0, compare_versions_1.satisfies)(file.version, this.query.version);\n            }\n            return valid;\n        });\n        if (this.takeQuery?.shuffle) {\n            validFiles = validFiles\n                ?.map(value => ({ value, sort: Math.random() }))\n                .sort((a, b) => a.sort - b.sort)\n                .map(({ value }) => value);\n        }\n        if (this.maxResults) {\n            validFiles = validFiles?.slice(0, this.maxResults);\n        }\n        return {\n            files: validFiles,\n            urls: validFiles?.map(({ name }) => `${mainPath}/${name}.json`)\n        };\n    }\n    async run() {\n        const { urls, files } = (await this.build()) || { urls: [] };\n        console.groupCollapsed(`Fetching ${urls?.length} files!`);\n        console.table(files.map(({ name }) => name));\n        console.groupEnd();\n        urls?.forEach(url => {\n            try {\n                setTimeout(() => {\n                    fetch(url, {\n                        method: 'GET',\n                        headers: {\n                            'Accept': 'application/json'\n                        }\n                    })\n                        .then((res) => {\n                        if (res.ok)\n                            return res.json();\n                        else\n                            throw new Error(\"Status code error: \" + res.status);\n                    })\n                        .then(data => {\n                        if (window.wp) {\n                            const block = wp?.blocks?.parse(data?.content);\n                            if (block) {\n                                wp?.data?.dispatch('core/block-editor')?.insertBlocks(block);\n                            }\n                            else {\n                                console.warn('Invalid block: ' + url);\n                            }\n                        }\n                        else {\n                            console.log('File loaded: ' + url);\n                        }\n                    });\n                }, Math.floor(Math.random() * 10) * 10);\n            }\n            catch (e) {\n                console.error(e);\n            }\n        });\n    }\n}\nif (window || globalThis) {\n    // @ts-ignore\n    const global = window || globalThis;\n    // @ts-ignore\n    global.QueryQA = QueryQA;\n    // @ts-ignore\n    global.queryQA = new QueryQA();\n}\nexports[\"default\"] = QueryQA;\n\n\n//# sourceURL=webpack://otter-query-engine/./src/index.ts?");

/***/ }),

/***/ "./node_modules/compare-versions/index.mjs":
/*!*************************************************!*\
  !*** ./node_modules/compare-versions/index.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"compare\": () => (/* binding */ compare),\n/* harmony export */   \"default\": () => (/* binding */ compareVersions),\n/* harmony export */   \"satisfies\": () => (/* binding */ satisfies),\n/* harmony export */   \"validate\": () => (/* binding */ validate)\n/* harmony export */ });\nfunction compareVersions(v1, v2) {\n  // validate input and split into segments\n  const n1 = validateAndParse(v1);\n  const n2 = validateAndParse(v2);\n\n  // pop off the patch\n  const p1 = n1.pop();\n  const p2 = n2.pop();\n\n  // validate numbers\n  const r = compareSegments(n1, n2);\n  if (r !== 0) return r;\n\n  // validate pre-release\n  if (p1 && p2) {\n    return compareSegments(p1.split('.'), p2.split('.'));\n  } else if (p1 || p2) {\n    return p1 ? -1 : 1;\n  }\n\n  return 0;\n}\n\nconst validate = (v) =>\n  typeof v === 'string' && /^[v\\d]/.test(v) && semver.test(v);\n\nconst compare = (v1, v2, operator) => {\n  // validate input operator\n  assertValidOperator(operator);\n\n  // since result of compareVersions can only be -1 or 0 or 1\n  // a simple map can be used to replace switch\n  const res = compareVersions(v1, v2);\n\n  return operatorResMap[operator].includes(res);\n};\n\nconst satisfies = (v, r) => {\n  // if no range operator then \"=\"\n  const m = r.match(/^([<>=~^]+)/);\n  const op = m ? m[1] : '=';\n\n  // if gt/lt/eq then operator compare\n  if (op !== '^' && op !== '~') return compare(v, r, op);\n\n  // else range of either \"~\" or \"^\" is assumed\n  const [v1, v2, v3] = validateAndParse(v);\n  const [r1, r2, r3] = validateAndParse(r);\n  if (compareStrings(v1, r1) !== 0) return false;\n  if (op === '^') {\n    return compareSegments([v2, v3], [r2, r3]) >= 0;\n  }\n  if (compareStrings(v2, r2) !== 0) return false;\n  return compareStrings(v3, r3) >= 0;\n};\n\n// export CJS style for parity\ncompareVersions.validate = validate;\ncompareVersions.compare = compare;\ncompareVersions.sastisfies = satisfies;\n\nconst semver =\n  /^[v^~<>=]*?(\\d+)(?:\\.([x*]|\\d+)(?:\\.([x*]|\\d+)(?:\\.([x*]|\\d+))?(?:-([\\da-z\\-]+(?:\\.[\\da-z\\-]+)*))?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?)?)?$/i;\n\nconst validateAndParse = (v) => {\n  if (typeof v !== 'string') {\n    throw new TypeError('Invalid argument expected string');\n  }\n  const match = v.match(semver);\n  if (!match) {\n    throw new Error(`Invalid argument not valid semver ('${v}' received)`);\n  }\n  match.shift();\n  return match;\n};\n\nconst isWildcard = (s) => s === '*' || s === 'x' || s === 'X';\n\nconst tryParse = (v) => {\n  const n = parseInt(v, 10);\n  return isNaN(n) ? v : n;\n};\n\nconst forceType = (a, b) =>\n  typeof a !== typeof b ? [String(a), String(b)] : [a, b];\n\nconst compareStrings = (a, b) => {\n  if (isWildcard(a) || isWildcard(b)) return 0;\n  const [ap, bp] = forceType(tryParse(a), tryParse(b));\n  if (ap > bp) return 1;\n  if (ap < bp) return -1;\n  return 0;\n};\n\nconst compareSegments = (a, b) => {\n  for (let i = 0; i < Math.max(a.length, b.length); i++) {\n    const r = compareStrings(a[i] || 0, b[i] || 0);\n    if (r !== 0) return r;\n  }\n  return 0;\n};\n\nconst operatorResMap = {\n  '>': [1],\n  '>=': [0, 1],\n  '=': [0],\n  '<=': [-1, 0],\n  '<': [-1],\n};\n\nconst allowedOperators = Object.keys(operatorResMap);\n\nconst assertValidOperator = (op) => {\n  if (typeof op !== 'string') {\n    throw new TypeError(\n      `Invalid operator type, expected string but got ${typeof op}`\n    );\n  }\n  if (allowedOperators.indexOf(op) === -1) {\n    throw new Error(\n      `Invalid operator, expected one of ${allowedOperators.join('|')}`\n    );\n  }\n};\n\n\n//# sourceURL=webpack://otter-query-engine/./node_modules/compare-versions/index.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;