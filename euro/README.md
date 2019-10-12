# JSON-stat for Eurostat

JSON-stat for Eurostat (**Euro**JSON**stat**, for short) is a JavaScript library to deal with Eurostat's [JSON-stat](https://json-stat.org/format/) API (requests and responses). EuroJSONstat is part of the [JSON-stat Toolkit](https://json-stat.com). It is meant to complement, not replace, Eurostat's own set of libraries ([eurostat.js](https://github.com/eurostat/eurostat.js)).

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
//To remove time removeTimeQuery() is more powerful than generic removeParamQuery()

//Retrieve a Eurostat standardized JSON-stat dataset using a query
EuroJSONstat.fetchDataset(uquery).then(ds=>{
  console.log(`"${query.dataset}" dataset has label "${ds.label}".`);

  const status=ds.Data(0).status;

  //Eurostat status meaning is easily retrieved
  console.log(`Status symbol of first observation is "${status}" which means "${EuroJSONstat.getStatusLabel(ds, status)}".`);

  //When standardized, Eurostat's datasets are enriched with roles
  console.log(`Classification dimensions: ${ds.role.classification}`);
});
```

### Resources

* [Installation](https://github.com/badosa/JSON-stat/blob/master/euro/docs/install.md)
* [API Reference](https://github.com/badosa/JSON-stat/blob/master/euro/docs/api.md)
