# JSON-stat Javascript Utilities Suite (JJUS)

JJUS is a library of high level functions built on top of the JSON-stat Javascript Toolkit (JJT).

Download the latest versions of [json-stat.js](https://github.com/badosa/JSON-stat/blob/master/json-stat.js) and [json-stat.utils.js](https://github.com/badosa/JSON-stat/blob/master/utils/json-stat.utils.js). Then in your webpage include the following links to your own copies of the json-stat.js and json-stat.utils.js files:

```html
<script src="/your-js-dir/json-stat.js"></script>
<script src="/your-js-dir/json-stat.utils.js"></script>
```

While JJT works on any browser, JJUS requires a modern one. If you need to support very old browsers, provide polyfills for *forEach*, *querySelector*, *querySelectorAll* and *trim*.

JJUS can also be run on the server as a [Node.js module](https://www.npmjs.com/package/jsonstat-utils). Type the following command to install:

```
npm install jsonstat-utils
```

This module has all the functionality of the client version except [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md).

JJUS includes 6 functions:

* [datalist()](https://github.com/badosa/JSON-stat/blob/master/utils/datalist.md)
* [fromCSV()](https://github.com/badosa/JSON-stat/blob/master/utils/fromcsv.md)
* [fromTable()](https://github.com/badosa/JSON-stat/blob/master/utils/fromtable.md)
* [join()](https://github.com/badosa/JSON-stat/blob/master/utils/join.md)
* [tbrowser()](https://github.com/badosa/JSON-stat/blob/master/utils/tbrowser.md) (Not available in the Node.js module.)
* [toCSV()](https://github.com/badosa/JSON-stat/blob/master/utils/tocsv.md)

In version 2.0.0, the JJUS interface was changed. The new interface is not backward compatible.

To check the JJUS version:

```js
JSONstatUtils.version
```
