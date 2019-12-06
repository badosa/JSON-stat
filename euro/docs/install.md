# Installation

> This documentation is about the **experimental release** (version 0) of JSON-stat for Eurostat. **DO NOT USE THIS VERSION**, it has been superseded by **version** 1 which has slightly different installation procedures and is available in at a **different repository** ([github.com/jsonstat/euro](https://github.com/jsonstat/euro))..

## Node.js module

```
npm install jsonstat-euro
```

```js
const EuroJSONstat=require("jsonstat-euro");
```

## ECMAScript module

```js
import * as EuroJSONstat from "https://unpkg.com/jsonstat-euro@0.1.6/export.mjs";
```

## In the browser

### Modern browsers

```html
<script src="https://unpkg.com/jsonstat@0.13.11"></script>
<script src="https://unpkg.com/jsonstat-euro@0.1.6"></script>
```

```html
<script type="module">
  import * as EuroJSONstat from "https://unpkg.com/jsonstat-euro@0.1.6/export.mjs";
</script>
```

### Old browsers

```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://unpkg.com/unfetch/polyfill"></script>
<script src="https://unpkg.com/jsonstat@0.13.11"></script>
<script src="https://unpkg.com/jsonstat-euro@0.1.6/eurostat-ie.js"></script>
```
