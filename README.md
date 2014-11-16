# JSON-stat

The JSON-stat format is a simple lightweight JSON format for data dissemination. It is based in a cube model that arises from the evidence that the most common form of data dissemination is the tabular form. In this cube model, **datasets** are organized in **dimensions**. Dimensions are organized in **categories**.

The JSON-stat format is documented at http://json-stat.org/format/.

The goal of the JSON-stat Javascript Toolkit (JJT) is to help dealing with JSON-stat responses in Javascript.

## Design principles

JSON-stat is based on a data cube information structure. The JSON-stat Javascript Toolkit exposes the data cube as a tree.

### The JSON-stat tree

 * *Dataset*
   * *Dimension*
     * *Category*
   * *Data*

For instance, to retrieve information about the first category of the first dimension of the first dataset in a JSON-stat response *j*, the JSON-stat Javascript Toolkit allows you to traverse the JSON-stat tree like this:

```js
JSONstat( j ).Dataset( 0 ).Dimension( 0 ).Category( 0 )
```

### General properties

 * *label*: label of the selected element (string)
 * *length*: number of children of the selected element (number).
 * *id*: IDs of the children of the selected element (array).

### Reading and traversing methods

These methods (except JSONstat, which is not actually a method) accept a selection argument (ID or index). If it is not provided, an array is returned with the information for every child of the selected element.

#### JSONstat

It reads a JSON-stat response and creates an internal *jsonstat* object.

```js
JSONstat( { ... } ).length
//number of datasets in the object

JSONstat( "http://json-stat.org/samples/oecd-canada.json" ).length
//number of datasets in oecd-canada.json. Sync connection.

JSONstat( "http://json-stat.org/samples/oecd-canada.json", 
   function(){
      console.log( this.length );
   }
)
//number of datasets in oecd-canada.json. Async connection.
```

#### Dataset

It selects a particular dataset in the JSON-stat response.

```js
JSONstat( j ).Dataset( 0 ).id //IDs of the dimensions in the first dataset
```

#### Dimension

It selects a particular dimension in a dataset in the JSON-stat response.

```js
JSONstat( j ).Dataset( 0 ).Dimension( "time" ).label
//Label of the "time" dimension in the first dataset

JSONstat( j ).Dataset( 0 ).Dimension( "country" ).role
//Role of the "country" dimension in the first dataset
```

#### Category

It selects a particular category in a dimension in a dataset in the JSON-stat response.

```js
JSONstat( j ).Dataset( 0 ).Dimension( "time" ).Category( 0 ).label
//Label of the first category of the "time" dimension in the first dataset
```

#### Data

When an argument is passed, selects a single cell of the data cube in the JSON-stat response. If no argument is passed, returns all the cells.

This method accepts the property "value" to get the value of a cell and "status" to get its status.

```js
JSONstat( j ).Dataset( 0 ).Data( 0 ).value
//Value of the first cell (usually a number, but values can be of any type).

JSONstat( j ).Dataset( 0 ).Data( [ 0, 0, 0 ] ).value
//Value of the first cell in a dataset with 3 dimensions (usually a number).

JSONstat( j ).Dataset( 0 ).Data( { "metric" : "UNR", "geo" : "GR", "time" : "2014" } ).value
//Unemployment rate in Greece in 2014 (usually a number).

JSONstat( j ).Dataset( 0 ).Data( { "metric" : "UNR", "geo" : "GR", "time" : "2014" } ).status
//Status of unemployment rate in Greece in 2014.
```

In object arguments, single category dimensions (&ldquo;constant dimensions&rdquo;) can be skipped. If one and only one non-constant dimension is not specified, the result will an array with as many elements as categories in the unspecified dimension.

### Transformation methods

Transformation methods get the information at a certain level of the JSON-stat tree and export it to other JSON structure for convenience.

#### toTable

This is a dataset method. It converts the information of a particular dataset into a JSON table. The conversion can be setup using an optional argument.

```js
JSONstat( j ).Dataset( 0 ).toTable()
//Returns an array of arrays that exposes a tabular structure (rows and columns).
//Useful in many situations. For example, it can be a Google Visualization API input. 

JSONstat( j ).Dataset( 0 ).toTable( { field : "id" } )
//Uses ids instead of labels as column names.

JSONstat( j ).Dataset( 0 ).toTable( { vlabel : "Valor", type : "object" } )
//Returns an object of arrays (of objects) that exposes a tabular structure (rows and columns)
//in the Google DataTable format (it's the native input format of Google
//Visualization API input). The "vlabel" property is instructing the method to use
//"Valor" as the label of the values column (instead of "Value").

JSONstat( j ).Dataset( 0 ).toTable( { status : true, slabel : "Metadata" } )
//The table will include a status column with label "Metadata".

JSONstat( j ).Dataset( 0 ).toTable( { type : "arrobj" } )
//Returns an array of objects where each dimension id is a property, plus a "value" property.

JSONstat( j ).Dataset( 0 ).toTable( { type: "arrobj", content: "id" } )
//same but category ids ("AU") are used instead of labels ("Australia") even for content.

JSONstat( j ).Dataset( "canada" ).toTable(
   { type : "arrobj", content : "id" },
   function( d, i ){
      if ( d.sex === "F" && d.concept === "POP" ){
         return { age : d.age, population : d.value*1000 };
      }
   }
)
//Get only the female population by age of Canada 
//and convert values from thousands to persons.
```

## Further information

For **installation** instructions, code **samples**, the **API reference**, etc., see the **[Wiki](https://github.com/badosa/JSON-stat/wiki)**.
