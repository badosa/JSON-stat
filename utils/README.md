# JSON-stat Javascript Utilities Suite (JJUS)

JJUS is a library of high level functions.

It can be run on the server as a Node.js module. Type the following command to install:

```
npm install jsonstat-utils
```

The module has all the functionality of the client version except [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md).

 The module's functionality is also available in the command line (install the [JSON-stat Command Line Conversion Tools](https://www.npmjs.com/package/jsonstat-conv)).

JJUS can also be run on a browser. All but its *from* functions are built on top of the JSON-stat Javascript Toolkit (JJT). Download the latest versions of [json-stat.js](https://github.com/badosa/JSON-stat/blob/master/json-stat.js) (JJT) and [json-stat.utils.js](https://github.com/badosa/JSON-stat/blob/master/utils/json-stat.utils.js) (JJUS).

In your webpage, link to your own copies of the json-stat.js and json-stat.utils.js files:

```html
<script src="/your-js-dir/json-stat.js"></script>
<script src="/your-js-dir/json-stat.utils.js"></script>
```

They are also available from the [jsDelivr CDN](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/jsonstat/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-utils/json-stat.utils.js"></script>
```

Or use a particular version:

```html
<script src="https://cdn.jsdelivr.net/npm/jsonstat@0.13.3/json-stat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsonstat-utils@2.4.0/json-stat.utils.js"></script>
```

While JJT works on any browser, JJUS requires a modern one. If you need to support very old browsers, provide polyfills for *forEach*, *Array.indexOf*, *trim*, *find* and *findIndex* (*querySelector*, *querySelectorAll* also required for [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md)).

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
