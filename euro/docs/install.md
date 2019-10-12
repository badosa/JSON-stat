# Installation

## Node.js module

```
npm install jsonstat-euro
```

```js
const EuroJSONstat=require("jsonstat-euro");
```

## ECMAScript module

```js
import * as EuroJSONstat from "https://unpkg.com/jsonstat-euro@0.1.2/export.mjs";
```

## In the browser

### Modern browsers

```html
<script src="https://cdn.jsdelivr.net/npm/jsonstat@0.13.9/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-euro@0.1.2/eurostat.js"></script>
```

```html
<script type="module">
  import * as EuroJSONstat from "https://unpkg.com/jsonstat-euro@0.1.2/export.mjs";
</script>
```

### Old browsers

```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://unpkg.com/unfetch/polyfill"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat@0.13.9/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-euro@0.1.2/eurostat-ie.js"></script>
```
