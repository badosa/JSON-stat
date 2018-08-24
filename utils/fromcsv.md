# fromCSV()

Converts a string in the Comma-Separated Values (CSV) file format to the JSON-stat dataset format.

**<code><i>object</i> JSONstatUtils.fromCSV ( <i>string</i> csv [, <i>object</i> options] )
</code>**

```js
var csv="place of birth,age group,gender,year,province of residence,concept,value\n ...";

var jsonstat=JSONstatUtils.fromCSV(
  csv,
  {
    label: "Imported from a CSV"
  }
);

var ds=JSONstat( jsonstat );

window.alert( ds.label ); //"Imported from a CSV"
window.alert( ds.n ); //Number of data
```

***

## Parameters

### csv (string): required

It must be a string in the Comma-Separated Values (CSV) format with a first row for labels and a column for each dimension, a column for values and optionally a column for statuses.

By default, a CSV with values in the last column and no status column is expected. Use **vlabel** and **slabel** options when this is not the case.

CSV-stat is also supported. The JSON-stat Comma-Separated Values format (CSV-stat, or JSV for short) is CSV plus a metadata header. CSV-stat supports all the JSON-stat dataset core semantics. This means that CSV-stat can be created using [toCSV](tocsv.md) and converted back to JSON-stat without loss of information (only the *note*, *link*, *child*, *coordinates* and *extension* properties are not currently supported).

When CSV-stat is detected, all options are ignored.

### options (object)

#### vlabel (string)

It is the name of the value column. When not provided, the value column must be the last one.

When CSV-stat is detected, *vlabel* is ignored.

#### slabel (string)

It is the name of the status column. By default, "Status". If no column has the specified name, no status information will be included in the output.

When CSV-stat is detected, *slabel* is ignored.

#### delimiter (string)

It is the character that will be used as the column separator. By default, ",".

When CSV-stat is detected, *delimiter* is ignored.

#### decimal (string)

It is the character that will be used as the decimal mark. By default, it is ".", unless **delimiter** is ";" (default decimal mark is then ",").

When CSV-stat is detected, *decimal* is ignored.

#### label (string)

It is a text that will be used as the dataset label. By default, "".

When CSV-stat is detected, *label* is ignored.

### Return Value

It returns an object in the JSON-stat format of class "dataset". This object can be processed by JJT. On error it returns *null*.
