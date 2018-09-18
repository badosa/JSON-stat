# fromSDMX()

Converts an object in the SDMX-JSON format to the JSON-stat dataset format.

**<code><i>object</i> JSONstatUtils.fromSDMX ( <i>object</i> sdmx )
</code>**

```js
var
  jsonstat=JSONstatUtils.fromSDMX( sdmx ),
  ds=JSONstat( jsonstat )
;

window.alert( ds.class ); //"dataset"
```

***

## Parameters

### sdmx (object): required

It must be an object in the SDMX-JSON format. Objects with more than one dataset are not supported. Intermediate grouping ("time series", "cross-section") is not supported, either. Only SDMX-JSON with a flat list of observations (*dimensionAtObservation=allDimensions*) is supported. This is sometimes referred to as the **SDMX-JSON flat format flavor**.

### Return Value

It returns an object in the JSON-stat format of class "dataset". This object can be processed by JJT. On error it returns *null*.
