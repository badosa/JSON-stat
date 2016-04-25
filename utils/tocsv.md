# toCSV()

Converts JSON-stat to the Comma Separated Values (CSV) file format. The JSON-stat input must be of class "dataset", "collection" (and have some embedded dataset) or "bundle".

**<code><i>string</i> or <i>object</i> JSONstatUtils.toCSV ( <i>object</i> or <i>string</i> jsonstat [, <i>object</i> options] )
</code>**

```js
JSONstat(
  "http://json-stat.org/samples/oecd.json",
  function(){
    var csv=JSONstatUtils.toCSV(
      this,
      {
        status: true, //Include status info
        slabel: "status",
        vlabel: "value"
      }
    );
    document.getElementsByTagName("body")[0].innerHTML="<pre>"+csv+"</pre>";
  }
);
```

***

## Parameters

### jsonstat (object, string): required

It can be an object in the JSON-stat format,

```js
var csv=JSONstatUtils.toCSV( {
  	"version" : "2.0",
  	"class" : "dataset",
  	"href" : "http://json-stat.org/samples/canada.json",
  	"label" : "Population by sex and age group. Canada. 2012",
    ...
} );
```

a *jsonstat* instance (the result of a JSON-stat object processed by JJT),

```js
var
  jsonstat={
    "version" : "2.0",
    "class" : "dataset",
    "href" : "http://json-stat.org/samples/canada.json",
    "label" : "Population by sex and age group. Canada. 2012",
    ...
  },
  csv=JSONstatUtils.toCSV( JSONstat( jsonstat ) )
;
```

or a string representing a URL

```js
var csv=JSONstatUtils.toCSV( "http://json-stat.org/samples/canada.json" );
```

This is practical (for demo purposes) but not recommended because it requires the use of a synchronous XMLHttpRequest, which is deprecated.

### options (object)

#### status (boolean)

It determines if a status column should be included. By default, *false*.

#### vlabel (string)

It is the name of the value column. By default, "Value".

#### slabel (string)

It is the name of the status column when **status** is *true*. By default, "Status".

#### na (string)

It is the string that will be used when a value is not available. By default, "n/a".

#### delimiter (string)

It is the character that will be used as the column separator. By default, ",".

#### decimal (string)

It is the character that will be used as the decimal mark. By default, it is ".", unless **delimiter** is ";" (default decimal mark is then ",").

#### dsid (positive integer or string)

It is used to select a dataset when the JSON-stat input is of class "collection" or "bundle". When a positive integer is specified, it is interpreted as an index. By default, it is 0 (first dataset).  When a string is specified, it is the id of the selected dataset.

### Return Value

It returns a string in the CSV format. On error it returns *null*.
