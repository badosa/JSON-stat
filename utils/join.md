# join()

Creates an object in the JSON-stat 2.0 dataset format from an array of objects in the JSON-stat 2.0 dataset format. The join can be sequential or by dimension


**<code><i>object</i> or <i>null</i> JSONstatUtils.join ( <i>array</i> parts [, <i>object</i> options] )
</code>**

```js
var
  //Returns object in the JSON-stat format
  json=JSONstatUtils.join( resp ),
  //Returns jsonstat instance
  ds=JSONstat( json )
;
```

***

## Parameters

### parts (array): required

Array of objects in the JSON-stat 2.0 dataset format. The way the join will be performed depends on the *by* property in the **options** object.

If no *by* is present, the join will be sequential (metadata + data + data + ...). In a sequential join, the first element in the **parts** array must be a representation of a dataset in the JSON-stat 2.0 dataset format with no data while the rest contain sequentially split data in the form of simplified JSON-stat 2.0 dataset responses (only the data part will be actually used). See, for example, [Sequential Dataset Join](http://bl.ocks.org/badosa/7245dccd2b8ea8a023c5c374a3fe0fe5).

If *by* is present and is the name of an existing dimension, a join by dimension is performed. In a join by dimension, a big dataset has been previously split according to the different categories of a dimension. As a consequence, all datasets in the array share the dimensions and only differ in the categories available for the splitting dimension. See, for example, [Dataset Join by Sex](http://bl.ocks.org/badosa/e1acf16f8a7ed871cff61d849706c202).

### options (object)

#### label (string)

It is the label of the resulting dataset. Usually, this property won't be needed when a sequential join is performed, as the dataset label in the first element can be used.

#### by (string)

It is the name of the dimension to be used in a join by dimension.

### Return Value

It returns an object in the JSON-stat 2.0 dataset format. On error it returns *null*.
