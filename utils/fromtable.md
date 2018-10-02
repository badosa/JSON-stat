# fromTable()

Converts an array with tabular data to the JSON-stat dataset format. This function performs the opposite conversion of the [toTable() method](https://github.com/badosa/JSON-stat/wiki/API-Reference#totable).

**<code><i>object</i> JSONstatUtils.fromTable ( <i>array</i> tbl [, <i>object</i> options] )
</code>**

```js
var
  tbl=[
    ["Country", "Year", "Concept", "Sex", "Value"],
    ["Canada", "2015", "Population", "Male", 17776719],
    ["Canada", "2015", "Population", "Female", 18075055],
    ["Canada", "2015", "Population", "Total", 35851774]
  ],

  jsonstat=JSONstatUtils.fromTable(
    tbl,
    {
      "label": "Data from http://www.statcan.gc.ca/tables-tableaux/sum-som/l01/cst01/demo10a-eng.htm"
    }
  ),

  ds=JSONstat( jsonstat )
;

window.alert( ds.n ); //Number of data (3)
window.alert( ds.Data( {"Sex": "Total"} ).value ); //Total population (35,851,774)
```

***

## Parameters

### tbl (array): required

It must be an array in one of the types supported by the [return values of the toTable() method](https://github.com/badosa/JSON-stat/wiki/API-Reference#return-value-6): "array" or "arrobj" (support for "object" is experimental).

By default, an array of arrays with no status column is expected. Use **type**, **vlabel** and **slabel** options when this is not the case.

### options (object)

#### type (string)

It describes the structure of the table. See the [return values of the toTable() method](https://github.com/badosa/JSON-stat/wiki/API-Reference#return-value-6). Supported structures are "array" and "arrobj". By default, "array".

#### vlabel (string)

It is the name of the value column. By default, "Value".

#### slabel (string)

It is the name of the status column. By default, "Status". If no column has the specified name, no status information will be included in the output.

#### label (string)

It is a text that will be used as the dataset label. By default, "".

#### ovalue (boolean)

When *true*, the *value* property in the resulting JSON-stat object will be an object instead of an array. By default, *false*.

(This option was mainly added for the [JSON-stat Command Line Conversion Tools](https://www.npmjs.com/package/jsonstat-conv) where speed is probably not critical. The way it is implemented in *fromTable()* requires post-processing the data. That's why it is not recommended unless size is more important than speed. Take into account that the resulting JSON-stat will be lighter using an object for *value* only if there are a lot of missing values.)

#### ostatus (boolean)

When *true*, the *status* property in the resulting JSON-stat object, if present, will be an object instead of an array. By default, *false*.

(This option was mainly added for the [JSON-stat Command Line Conversion Tools](https://www.npmjs.com/package/jsonstat-conv) where speed is probably not critical. The way it is implemented in *fromTable()* requires post-processing the data. That's why it is not recommended unless size is more important than speed. Usually, using an object for *status* returns a lighter JSON-stat because, usually, only a small amount of data has status information attached.)

#### drop (array)

It is an array of column labels to be dropped from the dataset. Only columns that do not act as dimensions (or are single-category dimensions) should be dropped. For example, a table could have a column for county names and another one for county codes: one of them must be dropped because they are the same dimension.


### Return Value

It returns an object in the JSON-stat format with *class* "dataset". This object can be processed by JJT. On error it returns *null*.
