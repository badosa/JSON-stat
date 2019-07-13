# JSON-stat Javascript Utilities Suite (JJUS)

JJUS is a set of high level functions.

It can be run on the server as a Node.js module. Type the following command to install:

```
npm install jsonstat-utils
```

The module has all the functionality of the client version except [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md).

 The module's functionality is also available in the command line (install the [JSON-stat Command Line Conversion Tools](https://www.npmjs.com/package/jsonstat-conv)).

JJUS can also be run on a browser as a library and as an ECMAScript module.

To include the JJUS library in your webpage, download the latest versions of [json-stat.js](https://github.com/badosa/JSON-stat/blob/master/json-stat.js) (JJT) and [json-stat.utils.js](https://github.com/badosa/JSON-stat/blob/master/utils/json-stat.utils.js) (JJUS). All but JJUS *from* functions are built on top of the JSON-stat Javascript Toolkit (JJT).

In your webpage, link to your own copies of the json-stat.js and json-stat.utils.js files:

```html
<script src="/your-js-dir/json-stat.js"></script>
<script src="/your-js-dir/json-stat.utils.js"></script>
```

They are also available from several CDNs ([jsDelivr](https://www.jsdelivr.com/), [unpkg](https://unpkg.com/)):

```html
<script src="https://cdn.jsdelivr.net/npm/jsonstat/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-utils/json-stat.utils.js"></script>
```

```html
<script src="https://unpkg.com/jsonstat/json-stat.js"></script>
<script src="https://unpkg.com/jsonstat-utils/json-stat.utils.js"></script>
```

Or using a particular version:

```html
<script src="https://cdn.jsdelivr.net/npm/jsonstat@0.13.8/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-utils@2.5.1/json-stat.utils.js"></script>
```

```html
<script src="https://unpkg.com/jsonstat@0.13.8/json-stat.js"></script>
<script src="https://unpkg.com/jsonstat-utils@2.5.1/json-stat.utils.js"></script>
```

While the JJT library works on any browser, the JJUS library requires a modern one. If you need to support very old browsers, provide polyfills for *forEach*, *Array.indexOf*, *trim*, *find*, *findIndex* and *reduce* (*querySelector*, *querySelectorAll* also required for [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md)).

To import the JJUS ECMAScript module in your webpage, download the latest versions of [export.js](https://github.com/badosa/JSON-stat/blob/master/export.js) and [utils/export.js](https://github.com/badosa/JSON-stat/blob/master/utils/export.js) and link to your own copy of the JJUS module:

```html
<script type="module">
  //Asumming JJT export.js is at "/your-js-dir/"
  import * as JSONstatUtils from "/your-js-dir/utils/export.js";

  //Or importing only a particular function instead of the whole module:
  //import { fromSDMX } from "/your-js-dir/utils/export.js";
</script>
```

Because the JJUS module requires the JJT module, you don't need to import JJT when you want to use JJT's JSONstat(). The JJUS module exposes JJT as JSONstatUtils.JSONstat:

```html
<script type="module">
  import * as JSONstatUtils from "/your-js-dir/utils/export.js";
  let JSONstat=JSONstatUtils.JSONstat;
</script>
```

Or

```html
<script type="module">
  import * as JSONstatUtils from "/your-js-dir/utils/export.js";
  import { JSONstat } from "/your-js-dir/utils/export.js";
</script>
```

The ECMAScript module is available from several CDNs ([jsDelivr](https://www.jsdelivr.com/), [unpkg](https://unpkg.com/)):

```html
<script type="module">
  import * as JSONstatUtils from "https://cdn.jsdelivr.net/npm/jsonstat@latest/utils/export.js";
</script>
```

```html
<script type="module">
  import * as JSONstatUtils from "https://unpkg.com/jsonstat/utils/export.js";
</script>
```

Using these CDNs you cannot freely choose a version of JJUS: you can only pick a version of JJT (and you will get the JJUS version associated with it).

```html
<script type="module">
  import * as JSONstatUtils from "https://cdn.jsdelivr.net/npm/jsonstat@0.13.8/utils/export.js";
  //You'll get JJUS 2.5.1
</script>
```

The JJUS ECMAScript module works on any browser that support ECMAScript modules.

JJUS includes 7 functions:

* [datalist()](https://github.com/badosa/JSON-stat/blob/master/utils/datalist.md)
* [fromCSV()](https://github.com/badosa/JSON-stat/blob/master/utils/fromcsv.md) (JJT not required)
* [fromSDMX()](https://github.com/badosa/JSON-stat/blob/master/utils/fromsdmx.md) (JJT not required)
* [fromTable()](https://github.com/badosa/JSON-stat/blob/master/utils/fromtable.md) (JJT not required)
* [join()](https://github.com/badosa/JSON-stat/blob/master/utils/join.md)
* [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md) (Not available in the Node.js module.)
* [toCSV()](https://github.com/badosa/JSON-stat/blob/master/utils/tocsv.md)

In version 2.0.0, the JJUS interface was changed. The new interface is not backward compatible.

To check the JJUS version:

```js
JSONstatUtils.version
```
