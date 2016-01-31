# JSON-stat Javascript Utilities Suite (JJUS)

JJUS is a library of high level functions built on top of the JSON-stat Javascript Toolkit (JJT).

Download the latest versions of [json-stat.js](https://github.com/badosa/JSON-stat/blob/master/json-stat.js) and [json-stat.utils.js](https://github.com/badosa/JSON-stat/blob/master/utils/json-stat.utils.js). Then in your webpage include the following links to your own copies of the json-stat.js and json-stat.utils.js files:

```html
<script src="/your-js-dir/json-stat.js"></script>
<script src="/your-js-dir/json-stat.utils.js"></script>
```

Check the JJUS version like this:

```js
JSONstatUtils.version
```

## JSONstatUtils.tbrowser()

Documentation pending.

## JSONstatUtils.datalist()

Documentation pending.

## JSONstatUtils.fromTable()

Documentation pending.

## JSONstatUtils.fromCSV()

Documentation pending.

## JSONstatUtils.toCSV()

### Description

This function converts JSON-stat to the Comma Separated Values (CSV) file format. The JSON-stat input must be of class "dataset", or of class "collection" with some embedded dataset (or of class "bundle").

### Parameters

It takes an object with the following properties:

#### jsonstat (string, object): required

It accepts a URL (string) that points to a JSON-stat document.

```js
var csv=JSONstatUtils.toCSV( {
  jsonstat: "http://json-stat.org/samples/canada.json"
} );
```

This is practical but not recommended because it requires the use of a synchronous XMLHttpRequest, which is deprecated.

It also accepts an object in the JSON-stat format:

```js
var csv=JSONstatUtils.toCSV( {
  jsonstat: {
  	"version" : "2.0",
  	"class" : "dataset",
  	"href" : "http://json-stat.org/samples/canada.json",
  	"label" : "Population by sex and age group. Canada. 2012",
    ...
  }
} );
```

Or a JSON-stat object already processed by JJT:

```js
var
  jsonstat={
    "version" : "2.0",
    "class" : "dataset",
    "href" : "http://json-stat.org/samples/canada.json",
    "label" : "Population by sex and age group. Canada. 2012",
    ...
  },
  csv=JSONstatUtils.toCSV( {
    jsonstat: JSONstat(jsonstat)
  } )
;
```

#### status (boolean)

It determines if a status column should be included. By default, *false*.

#### vlabel (string)

It is the name of the value column. By default, "Value".

#### slabel (string)

It is the name of the status column when **status** is *true*. By default, "Status".

#### na (string)

It is the string that will be used when a value is not available. By default, "n/a".

#### delimiter (string)

It is the character that will be used as the thousands separator. By default, ",".

#### decimal (string)

It is the character that will be used as the decimal mark. By default, it is ".", unless **delimiter** is ";", (default decimal mark is then ",").

#### dsid (positive integer or string)

When the JSON-stat input is of class "collection" (or "bundle"), it is used to select a dataset. When a positive integer is specified, it is interpreted as an index. By default, it is 0 (first dataset).  When a string is specified, it is the id of the selected dataset.

### Return Value

It returns a string in the CSV format.
