# JSON-stat for Eurostat

JSON-stat for Eurostat (**Euro**JSON**stat**, for short) is a JavaScript library to deal with Eurostat's [JSON-stat](https://json-stat.org/format/) API (requests and responses). **Euro**JSON**stat** is part of the [JSON-stat Toolkit](https://json-stat.com). It is meant to complement, not replace, Eurostat's own set of libraries ([eurostat.js](https://github.com/eurostat/eurostat.js)). While the latter addresses many issues, **Euro**JSON**stat** library is focused on JSON-stat-related ones.

For instance, Eurostat does not include roles in its datasets. **Euro**JSON**stat** offers a method to retrieve role-enriched datasets (*fetchDataset*) or allows you to add role information to an already retrieved Eurostat dataset (*setRole*). This is possible because Eurostat uses standardized dimension names.

JSON-stat does not provide a single way to describe status symbols. Instead, if offers the [extension](https://json-stat.org/format/#extension) property to allow providers to customize their JSON-stat responses to their needs. Eurostat uses a standardized way to attach a label to each status symbol. **Euro**JSON**stat** offers a method to retrieve such information (*getStatusLabel*).

A design principle of the JSON-stat format is the strict separation of data and metadata in order to allow the use of exactly the same structure for full (data and metadata) responses, data-only responses and metadata-only responses. Unfortunately, Eurostat does not support metadata-only responses (responses without *value* and *status*). **Euro**JSON**stat** offers ways to *try* to avoid this limitation (*fetchFullQuery*). It also includes a function to convert a full explicit query (see later) into a metadata-only dataset instance (*getEmptyDataset*).

* [Queries](#queries)
* [Filters](#filters)
* [Sample code](#sample-code)
* [Resources](#resources)

## Queries

Queries are a special kind of object used in many **Euro**JSON**stat** functions as an argument (input query) but also as a return value (output query).

A query must contain a dataset property with a valid Eurostat dataset code:

```js
{
  "dataset": "une_rt_a"
}
```

A query can optionally request information on one of the Eurostat-supported languages (default is English). A specific Eurostat API version can also be requested (default is 2.1):

```js
{
  "dataset": "une_rt_a",
  "lang": "fr",
  "version": "2.1"
}
```

Queries can filter data in datasets. For instance, dataset *une_rt_a* for Austria in years 2017-2018 would require this query:

```js
{
  "dataset": "une_rt_a",
  "filter": {
    "geo": ["AT"],
    "time": ["2017", "2018"]
  }
}
```

**Euro**JSON**stat** functions that return queries always include a *class* property with value "query" and can include label information. For instance, the previous **implicit query** (an input query that relies on some default parameters and values) can be tried to be translated into an **explicit query** (an equivalent query that includes all values requested explicitly or implicitly) using the *fetchQuery* function:

```js
EuroJSONstat.fetchQuery(iq, false).then(eq=>{
  if(eq.class!=="error"){
    console.log(eq);
  }
});
```

*fetchQuery* returns metadata-enriched queries:

```js
{
  "class": "query",
  "dataset": "une_rt_a",
  "filter": {
    "age": ["TOTAL", "Y25-74", "Y_LT25"],
    "unit": ["PC_ACT", "PC_POP", "THS_PER"],
    "sex": ["F", "M", "T"],
    "geo": ["AT"],
    "time": ["2017", "2018"]
  },
  "label": {
    "dataset": "Unemployment by sex and age - annual average",
    "dimension": {
      "age": "age",
      "unit": "unit",
      "sex": "sex",
      "geo": "geo",
      "time": "time"
    },
    "category": {
      "age": ["Total", "From 25 to 74 years", "Less than 25 years"],
      "unit": ["Percentage of active population", "Percentage of total population", "Thousand persons"],
      "sex": ["Females", "Males", "Total"],
      "geo": ["Austria"],
      "time": ["2018"]
    }
  },
  "lang": "en",
  "version": "2.1"
}
```

A **full explicit query** is a query that exposes all the dimensions and categories of a non-filtered dataset.

## Filters

Another special kind of object are filters. The "filter" property of queries are filters. They are made of parameters (properties of the filter object), usually dimension names, and a list of valid values (array), usually category names. For example:

```js
{
  "geo": ["AT"],
  "time": ["2017", "2018"]
}
```

Some **Euro**JSON**stat** functions accept filters as arguments. For example, the *addParamQuery* can create a new query from a query and a filter:

```js
EuroJSONstat.addParamQuery(
  //query
  {
    "dataset": "une_rt_a",
    "filter": {
      "geo": ["AT"],
      "time": ["2017", "2018"]
    }
  },
  //filter
  {
    "age": ["TOTAL"]
  }
);
```

## Sample code

```js
//A query
const query={
  dataset: "une_rt_a"
};

//Queries can be modified easily

//Add filter (Austria 2018) to previous query
const fquery=EuroJSONstat.addParamQuery(query, { geo: ["AT"], time: ["2018"] });
console.log(fquery);

//Translate query into Eurostat end-point
const url=EuroJSONstat.getURL(fquery);
console.log(url);

//Remove time and geo from previous filtered query
const uquery=EuroJSONstat.removeParamQuery(fquery, ["time", "geo"]);
console.log(uquery);
//To remove time, removeTimeQuery() is more powerful than generic removeParamQuery()

//Retrieve a Eurostat standardized JSON-stat dataset using a query
EuroJSONstat.fetchDataset(uquery).then(ds=>{
  if(ds.class==="dataset"){
    console.log(`"${query.dataset}" dataset has label "${ds.label}".`);

    const status=ds.Data(0).status;

    //Eurostat status meaning is easily retrieved
    console.log(`Status symbol of first observation is "${status}" which means "${EuroJSONstat.getStatusLabel(ds, status)}".`);

    //When standardized, Eurostat's datasets are enriched with roles
    console.log(`Classification dimensions: ${ds.role.classification}`);    
  }
});
```

## Resources

* [Installation](https://github.com/badosa/JSON-stat/blob/master/euro/docs/install.md)
* [API Reference](https://github.com/badosa/JSON-stat/blob/master/euro/docs/api.md)
