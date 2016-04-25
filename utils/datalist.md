# datalist()

Converts JSON-stat to an HTML table where each row contains information about a cell in the original cube. The JSON-stat input must be of class "dataset", "collection" (and have some embedded dataset) or "bundle".

**<code><i>string</i> or <i>object</i> JSONstatUtils.datalist ( <i>object</i> or <i>string</i> jsonstat [, <i>object</i> options] )
</code>**

```js
JSONstat(
  "http://json-stat.org/samples/galicia.json",
  function(){
    var html=JSONstatUtils.datalist(
      this,
      {
        counter: true
      }
    );
    document.getElementsByTagName("body")[0].innerHTML=html;
  }
);
```

***

## Parameters

### jsonstat (object, string): required

It can be an object in the JSON-stat format,

```js
var html=JSONstatUtils.datalist( {
    "version" : "2.0",
    "class" : "dataset",
    "href" : "http://json-stat.org/samples/galicia.json",
    "label" : "Population by province of residence, place of birth, age, gender and year in Galicia",
    ...
} );
```

a *jsonstat* instance (the result of a JSON-stat object processed by JJT),

```js
var
  jsonstat={
    "version" : "2.0",
    "class" : "dataset",
    "href" : "http://json-stat.org/samples/galicia.json",
    "label" : "Population by province of residence, place of birth, age, gender and year in Galicia",
    ...
  },
  html=JSONstatUtils.datalist( JSONstat( jsonstat ) )
;
```

or a string representing a URL

```js
var html=JSONstatUtils.datalist( "http://json-stat.org/samples/galicia.json" );
```

This is practical (for demo purposes) but not recommended because it requires the use of a synchronous XMLHttpRequest, which is deprecated.

### options (object)

#### counter (boolean)

It determines if a row counter column should be included. By default, *false*.

#### status (boolean)

It determines if a status column should be included. By default, *false*.

#### vlabel (string)

It is the name of the value column. By default, "Value".

#### slabel (string)

It is the name of the status column when **status** is *true*. By default, "Status".

#### na (string)

It is the string that will be used when a value is not available. By default, "n/a".

#### caption (string)

It is the string that will be used as the caption of the table. If it is not provided, the dataset label is used instead.

#### source (string)

When the dataset contains source information, this will be shown at the footer, by default just after the text "Source: ". You can use the source string to provide another word/s instead of "Source" (the colon and white space will be added automatically after it).

#### tblclass (string)

It is the class attribute of *table* element. There's no default class.

#### valclass (string)

It is the class attribute of *th* and *td* elements of the value column. There's no default class.

#### numclass (string)

It is the HTML class attribute of *th* and *td* elements in numeric columns (value and counter). There's no default class.

#### locale (string)

A string identifying a language according to [BCP 47](http://tools.ietf.org/html/rfc5646) to be used to format values. It will only be used if the browser supports Number.toLocaleString( locales ). By default, "en-US".

#### dsid (positive integer or string)

It is used to select a dataset when the JSON-stat input is of class "collection" or "bundle". When a positive integer is specified, it is interpreted as an index. By default, it is 0 (first dataset).  When a string is specified, it is the id of the selected dataset.

### Return Value

It returns an HTML table string. On error it returns *null*.
