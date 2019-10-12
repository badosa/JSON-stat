/*

JSON-stat for Eurostat v. 0.1.5 (requires JJT)
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
const EuroJSONstat=function(){"use strict";function e(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function t(e){if(e.dataset){const t=e.filter||null,r=e.lang||"en";let l=`https://ec.europa.eu/eurostat/wdds/rest/data/v${e.version||"2.1"}/json/${r}/${e.dataset}`,a=[];return t&&(Object.keys(t).forEach(e=>{t[e].forEach(t=>{a.push(`${e}=${t}`)})}),l+="?"+a.join("&")),l}return null}function r(t){const r=JSON.parse(JSON.stringify(t));return e(r,"filter")?(delete r.filter.time,r.filter.lastTimePeriod=["1"]):r.filter={lastTimePeriod:["1"]},r.class="query",r}function l(t,r){const l=JSON.parse(JSON.stringify(t));return e(l,"filter")&&(Object.keys(l.filter).forEach(e=>{l.filter[e]=l.filter[e].slice(0,1)}),!0===r&&(delete l.filter.time,l.filter.lastTimePeriod=["1"])),e(l,"label")&&e(l.label,"category")&&(Object.keys(l.label.category).forEach(e=>{l.label.category[e]=l.label.category[e].slice(0,1)}),!0===r&&delete l.label.category.time),l.class="query",l}function a(t,r){const l=JSON.parse(JSON.stringify(t)),a=e(l,"filter"),s=e(l,"label"),o=s&&e(l.label,"category"),i=s&&e(l.label,"dimension");return r.forEach(e=>{a&&delete l.filter[e],s&&(o&&delete l.label.category[e],i&&delete l.label.dimension[e])}),l.class="query",l}function s(t,r,l){void 0===l&&(l=Object.keys(r),r={class:"query",dataset:null,filter:r});const a=JSON.parse(JSON.stringify(t)),s=e(r,"filter"),o=e(r,"label")&&e(r.label,"category");return l.forEach(t=>{s&&e(r.filter,t)&&(e(a,"filter")||(a.filter={}),a.filter[t]=r.filter[t]),o&&e(r.label.category,t)&&(e(a,"label")?e(a.label,"category")||(a.label.category={}):a.label={},a.label.category[t]=r.label.category[t])}),a.class="query",a}function o(e){e.role={geo:[],time:[],metric:[],classification:[]},e.id.forEach(t=>{switch(e.Dimension(t).role="time"===t||"geo"===t?t:"classification",t){case"geo":case"time":e.role[t].push(t);break;case"unit":case"s_adj":e.role.metric.push(t);break;default:e.role.classification.push(t)}})}const i=new Function("try {return this===global;}catch(e){return false;}");function n(e){let r;if(r=i()?require("unfetch"):"function"!=typeof fetch?function(){window.alert("JSONstat for Eurostat: Old browsers are not supported, sorry. Use a polyfill for Fetch and Promise.")}:fetch,e)return r("string"==typeof e?e:t(e)).then(e=>e.json()).then(e=>{if(e.error)return{class:"error",status:e.error.status,label:e.error.label};{const t=JSONstat(e);return"dataset"===t.class?(o(t),t):{class:"error",status:"422",label:"Unprocessable Entity"}}})}function c(e,t){const l=!1!==t?r(e):e;return n(l).then(e=>{if("error"===e.class)return e;const t={},r={},a={};return e.id.forEach(l=>{const s=e.Dimension(l);r[l]=s.label,t[l]=s.id,a[l]=s.Category().map(e=>e.label)}),{dataset:l.dataset,filter:t,label:{dataset:e.label,dimension:r,category:a}}})}return{simpleQuery:l,lastPeriodQuery:r,addParamQuery:s,removeParamQuery:a,removeTimeQuery:function(e){return a(e,["time","lastTimePeriod","sinceTimePeriod"])},fetchQuery:c,fetchFullQuery:function(e,t){return c("string"==typeof t?s(e,{geo:[t]}):e).then(e=>"error"===e.class?e:c(a(l(e),["time","geo"]),!1).then(t=>"error"===t.class?t:s(e,t,["time","geo"])))},fetchDataset:n,getURL:t,getStatusLabel:function(e,t){return e.extension.status.label[t]},setRole:o,version:"0.1.5"}}();
