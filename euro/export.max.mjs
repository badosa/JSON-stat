/*

JSON-stat for Eurostat v. 0.1.7 (requires JJT ES6 module) (ES6 module)
https://json-stat.com
https://github.com/badosa/JSON-stat/tree/master/eurostat

Copyright 2019 Xavier Badosa (https://xavierbadosa.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied. See the License for the specific language governing
permissions and limitations under the License.

*/

/* jshint newcap:false,esversion:8*/

import { JSONstat } from "../jsonstat/export.mjs";

const version="0.1.7";

/**
 * Safely checks the existance of property f in object q
 * @param {Object} q Object
 * @param {string} f Property name
 * @returns {boolean} Similar implicit query filtered for the last time period
 */
function hasProp(q, f){
  return Object.prototype.hasOwnProperty.call(q, f);
}

/**
 * Converts a query into a Eurostat URL
 * @param {Object} query Query
 * @returns {string} Eurostat API end point
 */
function getURL(query){
  const APIbase="https://ec.europa.eu/eurostat/wdds/rest/data/";

  if(query.dataset){
    const
      filter=query.filter || null,
      lang=query.lang || "en",
      version=query.version || "2.1"
    ;
    let
      url=`${APIbase}v${version}/json/${lang}/${query.dataset}`,
      param=[]
    ;

    if(filter){
      Object.keys(filter).forEach(dim=>{
        filter[dim].forEach(value=>{
          param.push(`${dim}=${value}`);
        });
      });
      url+="?"+param.join("&");
    }

    return url;
  }

  //no dataset provided
  return null;
}

/**
 * Adds a last time period filter to an implicit query. Doesn't care about labels.
 * @param {Object} query Implicit query
 * @returns {Object} Similar implicit query filtered for the last time period
 */
function lastPeriodQuery(query){
  const q=JSON.parse(JSON.stringify(query));

  if(hasProp(q, "filter")){
    delete q.filter.time;
    q.filter.lastTimePeriod=["1"];
  }else{
    q.filter={
      "lastTimePeriod": ["1"]
    };
  }

  q.class="query";
  return q;
}

/**
 * Tries to tansforms a query into a new one that returns a single cell cube
 * (single cell guaranteed if original query is a fully explicit one)
 * @param {Object} query Fully explicit query
 * @returns {Object} New query for the last period and the first category of each dimension
 */
function simpleQuery(query, time){
  const q=JSON.parse(JSON.stringify(query));

  //Only equeries with filter can be uniqueried
  if(hasProp(q, "filter")){
    Object.keys(q.filter).forEach(f=>{q.filter[f]=q.filter[f].slice(0,1);});
    if(time===true){
      delete q.filter.time;
      q.filter.lastTimePeriod=["1"];
    }
  }

  if(
    hasProp(q, "label") &&
    hasProp(q.label, "category")
  ){
    Object.keys(q.label.category).forEach(f=>{q.label.category[f]=q.label.category[f].slice(0,1);});
    if(time===true){
      delete q.label.category.time;
    }
  }

  q.class="query";
  return q;
}

/**
 * Removes parameters from a query
 * @param {Object} query Fully explicit query
 * @param {Array} params List of parameters to be removed from query
 * @returns {Object} New query without the specified parameters
 */
function removeParamQuery(query, params){
  const
    q=JSON.parse(JSON.stringify(query)),
    hasFilter=hasProp(q, "filter"),
    hasLabel=hasProp(q, "label"),
    hasCategory=hasLabel && hasProp(q.label, "category"),
    hasDimension=hasLabel && hasProp(q.label, "dimension")
  ;

  params.forEach(param=>{
    if(hasFilter){
      delete q.filter[param];
    }

    if(hasLabel){
      if(hasCategory){
        delete q.label.category[param];
      }
      if(hasDimension){
        delete q.label.dimension[param];
      }
    }
  });

  q.class="query";
  return q;
}

/**
 * Removes time parameters from a query
 * Eurostat allows to specify time in several ways
 * @param {Object} query Fully explicit query
 * @returns {Object} New query without time parameters
 */
function removeTimeQuery(query){
  return removeParamQuery(query, ["time", "lastTimePeriod", "sinceTimePeriod"]);
}

/**
 * Transforms a filter into a query
 * @param {Object} filter Querifiable object (ex. { "geo": ["AT"]} })
 * @returns {Object} Dummy query (no dataset) for transformation purposes
 */
function querify(filter){
  return {
    class: "query",
    dataset: null,
    filter
  };
}

/**
 * Imports the specified parameters to a query from a new query
 * or from a filter (ex. { "geo": ["AT"]} })
 * @param {Object} query Original query
 * @param {Object|Array} aquery New query or a filter (see querify())
 * @param {Array} [params] Optional List of parameters to be imported
 * @returns {Object} New query without the specified parameters
 */
 function addParamQuery(query, aquery, params){
   //Two arguments instead of three
   if(typeof params==="undefined"){
     params=Object.keys(aquery);
     aquery=querify(aquery);
   }

   const
     q=JSON.parse(JSON.stringify(query)),
     aHasFilter=hasProp(aquery, "filter"),
     aHasCategory=
       hasProp(aquery, "label") &&
       hasProp(aquery.label, "category")
   ;

   params.forEach(param=>{
     if(
       aHasFilter &&
       hasProp(aquery.filter, param)
     ){
       if(!hasProp(q, "filter")){
         q.filter={};
       }

       q.filter[param]=aquery.filter[param];
     }

     if(
       aHasCategory &&
       hasProp(aquery.label.category, param)
     ){
       if(!hasProp(q, "label")){
         q.label={};
       }else if(!hasProp(q.label, "category")){
         q.label.category={};
       }

       q.label.category[param]=aquery.label.category[param];
     }
   });

   q.class="query";
   return q;
 }

/**
 * Translates a Eurostat status id into a status label
 * @param {Object} ds jsonstat dataset instance
 * @param {string} s Status id
 * @returns {string} Status label
 */
function getStatusLabel(ds,s){
  return ds.extension.status.label[s];
}

/**
 * Adds role information to a Eurostat jsonstat dataset instance
 * by modifying it.
 * @param {Object} ds jsonstat dataset instance
 */
function setRole(ds){
  ds.role={
    geo: [],
    time: [],
    metric: [],
    classification: []
  };

  ds.id.forEach(d=>{
    ds.Dimension(d).role=(d==="time" || d==="geo") ? d : "classification";

    switch(d){
      case "geo":
      case "time":
        ds.role[d].push(d);
      break;
      case "unit":
      case "s_adj":
        ds.role.metric.push(d);
      break;
      default:
        ds.role.classification.push(d);
    }
  });
}

/**
 * Check environment
 * @returns {boolean} true if Node
 */
const isNode=new Function("try {return this===global;}catch(e){return false;}");

//You can specify a URL or dataset code, filter, lang, version:
//required url or dataset
//Gets an equery: returns a promise with a JSONstat ds object
//Async promise

/**
 * Fetches (async) a normalized Eurostat jsonstat dataset.
 * @param {string|Object} query A Eurostat API endpoint or a query
 * @returns {Object} jsonstat dataset instance on success
 */
function fetchDataset(o){
  let goGet;
  if(isNode()){
    goGet=require('node-fetch');
  }else{
    if(typeof fetch!=="function"){//Old browsers (won't happen thanks to polyfill)
      goGet=function(){window.alert("JSONstat for Eurostat: Old browsers are not supported, sorry. Use a polyfill for Fetch and Promise.");};
    }else{
      goGet=fetch;
    }
  }

  if(o){
    return goGet( (typeof(o)==="string") ? o : getURL(o) )
      .then(resp=>resp.json())
      .then(json=>{
        if(json.error){
          return {
            class: "error",
            status: json.error.status,
            label: json.error.label
          };
        }else{
          const ds=JSONstat(json);
          if(ds.class==="dataset"){
            setRole(ds);
            return ds;
          }else{
            return {
              class: "error",
              status: "422",
              label: "Unprocessable Entity"
            };
          }
        }
      })
    ;
  }
}

/**
 * Converts (async) an implicit query into an explicit one
 * by fetching a dataset
 * @param {Object} query Implicit query
 * @param {boolean} [last] true to retrieve all time (instead of last cat.)
 * @returns {Object} an explicit query on success
 */
function fetchQuery(query, last){
  const q=(last!==false) ? lastPeriodQuery(query) : query;

  return fetchDataset(q).
    then(ds=>{
      if(ds.class==="error"){
        return ds;
      }

      const
        filter={},
        dimension={},
        category={}
      ;
      ds.id.forEach(d=>{
        const dim=ds.Dimension(d);

        dimension[d]=dim.label;
        filter[d]=dim.id;
        category[d]=dim.Category().map(e=>e.label);
      });

      return {
        dataset: q.dataset,
        filter,
        label: {
          dataset: ds.label,
          //not very useful in the case of present Eurostat API: label=id
          dimension,
          category
        }
      };
    })
  ;
}

/**
 * Tries to convert (async) an unfiltered query into a fully explicit one
 * by fetching datasets
 * @param {Object} query Dataset code expressed as an unfiltered query
 * @param {Object} [geo] Geograhical category
 * @returns {Object} a fully explicit query on success
 */
function fetchFullQuery(query, geo){
  const filter=(typeof geo==="string") ?
    addParamQuery(query, {geo: [geo]})
    :
    addParamQuery(query, {filterNonGeo: ["1"]})
  ;

  return fetchQuery( filter ).then(e=>{
    if(e.class==="error"){
      return e;
    }

    return fetchQuery( removeParamQuery(simpleQuery(e), ["time", "geo"]) , false).then(
      t=>{
        if(t.class==="error"){
          return t;
        }
        return addParamQuery(e,t,["time","geo"]);
      }
    );
  });
}

export {
  JSONstat,

  //Query functions
  simpleQuery,
  lastPeriodQuery,
  addParamQuery,
  removeParamQuery,
  removeTimeQuery,

  //Async functions
  fetchQuery,
  fetchFullQuery,
  fetchDataset,

  //Translation functions
  getURL,
  getStatusLabel,

  //DS transformation functions
  setRole,

  version
};
