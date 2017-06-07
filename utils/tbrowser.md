# tbrowser()

Inserts an interactive table ("table browser") displaying the data of a JSON-stat dataset inside an HTML document element. The JSON-stat input must be of class "dataset", "collection" (and have some embedded dataset) or "bundle". Currently, the JSON-stat dataset to be displayed must have at least two dimensions.

**Warning:** This function are not available in the [JJUS Node.js module](https://www.npmjs.com/package/jsonstat-utils).

**<code>JSONstatUtils.tbrowser ( <i>object</i> or <i>string</i> jsonstat , <i>object</i> element [, <i>object</i> options] )
</code>**

```js
JSONstat(
  "http://json-stat.org/samples/galicia.json",
  function(){
    JSONstatUtils.tbrowser(
      this,
      document.getElementById("tbrowser"),
      {
        preset: "smaller"
      }
    );
  }
);
```

***

## Parameters

### jsonstat (object, string): required

It can be an object in the JSON-stat format,

```js
JSONstatUtils.tbrowser(
  {
    "version" : "2.0",
    "class" : "dataset",
    "href" : "http://json-stat.org/samples/galicia.json",
    "label" : "Population by province of residence, place of birth, age, gender and year in Galicia",
    ...
  },
  document.getElementById("tbrowser"),
  {
    preset: "smaller"
  }
);
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
  }
;

JSONstatUtils.tbrowser(
  JSONstat( jsonstat ),
  document.getElementById("tbrowser"),
  {
    preset: "smaller"
  }
);
```

or a string representing a URL

```js
JSONstatUtils.tbrowser(
  "http://json-stat.org/samples/galicia.json",
  document.getElementById("tbrowser"),
  {
    preset: "smaller"
  }
);
```

This is practical (for demo purposes) but not recommended because it requires the use of a synchronous XMLHttpRequest, which is deprecated.

### element (object): required

It specifies the element where the table will be inserted into. It must be an existing HTML element object.

### options (object)

#### status (boolean)

It determines if the status should be shown. By default, *false*. When *true*, status is included in parentheses after the value in each cell where is available.

#### tblclass (string)

It is the class attribute of *table* element. There's no default class.

#### preset (string)

It determines the initial layout of the table. When not set, tbrowser() selects the first two dimensions in the dataset as row and column. Of these two, the one with the lower number of categories will be used as columns. If there are more than two dimensions in the dataset, the rest will be used as filters (with their first category selected) and constants.

**preset** allows you to change the selection criterion of these two dimensions. By default, order in the dataset is taken into account. You can consider this the simpler (and faster) criterion.

If **preset** is "bigger", the two dimensions with the highest number of categories will be selected.

Currently, any other string will be interpreted as "smaller": the two dimensions with the lowest number of categories will be selected.

#### nonconst (boolean)

When *true*, dimensions with a single category are removed from the dataset and are used in the caption of the table (instead of the dataset label), not in the Constants section. Default is *false*.

This property is ignored if the dataset does not contain any dimension with a single category.

Warning: if **jsonstat** is a *jsonstat* instance, it will be modified by tbrowser() when **noconst** is *true*.

#### i18n (object)

It is an object with the following internationalization properties:

##### locale (string)

A string identifying a language according to [BCP 47](http://tools.ietf.org/html/rfc5646) to be used to format values. It will only be used if the browser supports Number.toLocaleString( locales ). By default, "en-US".

##### msgs (object)

An object with several texts used in the table. Properties and default values are:

```js
{
  "urierror": 'tbrowser: A valid JSON-stat input must be specified.',
  "selerror": 'tbrowser: A valid selector must be specified.',
  "jsonerror": "The request did not return a valid JSON-stat dataset.",
  "dimerror": "Only one dimension was found in the dataset. At least two are required.",
  "dataerror": "Selection returned no data!",
  "source": "Source",
  "filters": "Filters",
  "constants": "Constants",
  "rc": "Rows &amp; Columns",
  "na": "n/a" //Not available symbol for null values
}
```

#### dsid (positive integer or string)

It is used to select a dataset when the JSON-stat input is of class "collection" or "bundle". When a positive integer is specified, it is interpreted as an index. By default, it is 0 (first dataset).  When a string is specified, it is the id of the selected dataset.

### Return Value

Void.
