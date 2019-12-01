# fromSDMX()

Converts an object in the SDMX-JSON format to the JSON-stat dataset format.

**<code><i>object</i> JSONstatUtils.fromSDMX ( <i>object</i> sdmx [, <i>object</i> options] )
</code>**

```js
var
  jsonstat=JSONstatUtils.fromSDMX( sdmx ),
  ds=JSONstat( jsonstat )
;

window.alert( ds.class ); //"dataset"
```

**fromSDMX() does not support Internet Explorer unless polyfills are provided for [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) and [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).**

***

## Parameters

### sdmx (object): required

It must be an object in the SDMX-JSON format. Objects with more than one dataset are not supported. Intermediate grouping ("time series", "cross-section") is not supported, either. Only SDMX-JSON with a flat list of observations (*dimensionAtObservation=allDimensions*) is supported. This is sometimes referred to as the **SDMX-JSON flat format flavor**.

### options (object)

#### ovalue (boolean)

When *true*, the *value* property in the resulting JSON-stat object will be an object instead of an array. By default, *false*.

(Using an object for *value* returns a lighter JSON-stat only if there are a lot of missing values. Unlike [fromTable()](https://github.com/badosa/JSON-stat/blob/master/utils/fromtable.md) and [fromCSV()](https://github.com/badosa/JSON-stat/blob/master/utils/fromcsv.md), this option does not require post-processing the data in *fromSDMX*.)

#### ostatus (boolean)

When *true*, the *status* property in the resulting JSON-stat object, if present, will be an object instead of an array. By default, *false*.

(Usually, using an object for *status* returns a lighter JSON-stat because, usually, only a small amount of data has status information attached.)

### Return Value

It returns an object in the JSON-stat format of class "dataset". This object can be processed by JJT. On error it returns *null*.
