/*

JSON-stat Javascript Toolkit v. 0.8.0
http://json-stat.org
https://github.com/badosa/JSON-stat

Copyright 2015 Xavier Badosa (http://xavierbadosa.com)

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
function JSONstat(t,e){return window===this?new JSONstat.jsonstat(t,e):void 0}var JSONstat=JSONstat||{}
JSONstat.version="0.8.0",function(){"use strict"
function t(t){return"[object Array]"===Object.prototype.toString.call(t)}function e(e,n){function i(e,n){var i=[]
if("string"==typeof e&&(e=[e]),t(e)){if(e.length===n)return e
if(1===e.length){for(var r=0;n>r;r++)i.push(e[0])
return i}}for(var r=0;n>r;r++){var s=void 0===e[r]?null:e[r]
i.push(s)}return i}var r=function(t,e){var n,i=e!==!1
if(window.XDomainRequest&&/^(http(s)?:)?\/\//.test(t)){if(!i)return
var r=new XDomainRequest
r.onload=function(){n=JSON.parse(r.responseText),e.call(JSONstat(n))},r.open("GET",t),r.send()}else{var r=new XMLHttpRequest
if(r.onreadystatechange=function(){if(4===r.readyState){var t=r.status
n=t&&r.responseText&&(t>=200&&300>t||304===t)?JSON.parse(r.responseText):null,i&&e.call(JSONstat(n))}},r.open("GET",t,i),r.send(null),!i)return n}}
if(this.length=0,this.id=[],null!==e&&void 0!==e)switch(this["class"]=e["class"]||"bundle",this["class"]){case"bundle":var s=[],l=0
if(this.error=null,this.length=0,"string"==typeof e&&e.length>0&&(e=r(e,"function"==typeof n?n:!1)),null===e||"object"!=typeof e)return
if(e.hasOwnProperty("error"))return void(this.error=e.error)
if("dataset"===e["class"]||"collection"===e["class"])return JSONstat(e)
for(var a in e)l++,s.push(a)
this.__tree__=e,this.length=l,this.id=s
break
case"dataset":e.hasOwnProperty("__tree__")||(delete e["class"],e={__tree__:e})
var o=e.__tree__
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.updated=o.updated||null,this.source=o.source||null,this.extension=o.extension||null
var u=0
if(o.hasOwnProperty("value")&&t(o.value))u=o.value.length
else if(o.hasOwnProperty("status")&&t(o.status))u=o.status.length
else if(o.hasOwnProperty("dimension")){for(var h=o.dimension.size,f=1,c=h.length;c--;)f*=h[c]
u=f}if(this.value=i(o.value,u),this.status=o.hasOwnProperty("status")?i(o.status,u):null,o.hasOwnProperty("dimension")){if(!t(o.dimension.id)||!t(o.dimension.size)||o.dimension.id.length!=o.dimension.size.length)return
var d=o.dimension,v=d.role||null,p=d.id,g=d.size.length,y=function(t){v.hasOwnProperty(t)||(v[t]=null)}
if(this.length=g,this.id=p,v&&(y("time"),y("geo"),y("metric"),y("classification")),v&&null===v.classification){for(var _=[],b=function(t,e){for(var n=e.length;n--;)if(t===e[n])return!0
return!1},c=0,m=["time","geo","metric"];3>c;c++){var w=v[m[c]]
null!==w&&(_=_.concat(w))}v.classification=[]
for(var c=0;g>c;c++)b(p[c],_)||v.classification.push(p[c])
0===v.classification.length&&(v.classification=null)}this.role=v,this.n=u
for(var O=0,x=this.length;x>O;O++)if(d[d.id[O]].category.hasOwnProperty("index")){if(t(d[d.id[O]].category.index)){for(var S={},k=d[d.id[O]].category.index,s=0,P=k.length;P>s;s++)S[k[s]]=s
d[d.id[O]].category.index=S}}else{var D=0
d[d.id[O]].category.index={}
for(var a in d[d.id[O]].category.label)d[d.id[O]].category.index[a]=D++}}else this.length=0
break
case"dimension":var j=[],o=e.__tree__,J=o.category
if(!e.hasOwnProperty("__tree__")||!o.hasOwnProperty("category"))return
if(!J.hasOwnProperty("label")){J.label={}
for(var a in J.index)J.label[a]=a}for(var a in J.index)j[J.index[a]]=a
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.id=j,this.length=j.length,this.role=e.role,this.hierarchy=J.hasOwnProperty("child"),this.extension=o.extension||null
break
case"category":var N=e.child
this.id=N,this.length=null===N?0:N.length,this.index=e.index,this.label=e.label,this.note=e.note||null,this.unit=e.unit,this.coordinates=e.coord
break
case"collection":if(this.length=0,this.label=e.label||null,this.note=e.note||null,this.link=e.link||null,this.href=e.href||null,this.updated=e.updated||null,this.source=e.source||null,this.extension=e.extension||null,null!==this.link&&e.link.item){var T=e.link.item
if(this.length=t(T)?T.length:0,this.length)for(var s=0;s<this.length;s++)this.id[s]=T[s].href}}}e.prototype.Item=function(t){if(null===this||"collection"!==this["class"]||!this.length)return null
if("number"==typeof t)return t>this.length||0>t?null:this.link.item[t]
var e,n=[]
"object"==typeof t?t["class"]?e=function(t,e,i){i["class"]===t.link.item[e]["class"]&&n.push(t.link.item[e])}:t.follow&&(e=function(t,e){n.push(JSONstat(t.id[e]))}):e=function(t,e){n.push(t.link.item[e])}
for(var i=0;i<this.length;i++)e(this,i,t)
return n},e.prototype.Dataset=function(t){if(null===this||"bundle"!==this["class"])return null
if(void 0===t){for(var n=[],i=0,r=this.id.length;r>i;i++)n.push(this.Dataset(this.id[i]))
return n}if("number"==typeof t){var s=this.id[t]
return void 0!==s?this.Dataset(s):null}var l=this.__tree__[t]
return void 0===l?null:new e({"class":"dataset",__tree__:l})},e.prototype.Dimension=function(t){function n(t,e){var n=t.role
if(null!==n)for(var i in n)for(var r=null!==n[i]?n[i].length:0;r--;)if(n[i][r]===e)return i
return null}if(null===this||"dataset"!==this["class"])return null
if(void 0===t){for(var i=[],r=0,s=this.id.length;s>r;r++)i.push(this.Dimension(this.id[r]))
return i}if("number"==typeof t){var l=this.id[t]
return void 0!==l?this.Dimension(l):null}var a=this.__tree__.dimension
if(void 0===a)return null
if("object"==typeof t){if(t.hasOwnProperty("role")){for(var i=[],r=0,s=this.id.length;s>r;r++){var o=this.id[r]
n(a,o)===t.role&&i.push(this.Dimension(o))}return void 0===i[0]?null:i}return null}var u=a[t]
return void 0===u?null:new e({"class":"dimension",__tree__:u,role:n(a,t)})},e.prototype.Category=function(t){if(null===this||"dimension"!==this["class"])return null
if(void 0===t){for(var n=[],i=0,r=this.id.length;r>i;i++)n.push(this.Category(this.id[i]))
return n}if("number"==typeof t){var s=this.id[t]
return void 0!==s?this.Category(s):null}var l=this.__tree__.category
if(void 0===l)return null
var a=l.index[t]
if(void 0===a)return null
var o=l.unit&&l.unit[t]||null,u=l.coordinates&&l.coordinates[t]||null,h=l.child&&l.child[t]||null,f=l.note&&l.note[t]||null
return new e({"class":"category",index:a,label:l.label[t],note:f,child:h,unit:o,coord:u})},e.prototype.Data=function(e){function n(t){for(var e in t)if(t.hasOwnProperty(e))return e}function i(t,e){for(var i=[],r=t.dimension,s=r.id,l=0,a=s.length;a>l;l++){var o=s[l],u=e[o]
i.push("string"==typeof u?u:1===r.size[l]?n(r[o].category.index):null)}return i}if(null===this||"dataset"!==this["class"])return null
if(void 0===e){for(var r=0,s=[],l=this.value.length;l>r;r++)s.push(this.Data(r))
return s}if("number"==typeof e){var a=this.value[e]
return void 0!==a?{value:a,status:this.status?this.status[e]:null}:null}var o=this.__tree__,u=o.dimension.size,h=u.length
if(t(e)){if(this.length!==e.length)return null
for(var f=1,c=0,d=[],v=[],s=[],r=0;h>r;r++)if(void 0!==e[r]){if("number"!=typeof e[r]||e[r]>=u[r])return null
f*=r>0?u[h-r]:1,c+=f*e[h-r-1]}else d.push(r),v.push(u[r])
if(d.length>1)return null
if(1===d.length){for(var p=0,g=v[0];g>p;p++){for(var y=[],r=0;h>r;r++)y.push(r!==d[0]?e[r]:p)
s.push(this.Data(y))}return s}return{value:this.value[c],status:this.status?this.status[c]:null}}for(var _=i(o,e),b=[],m=o.dimension,r=0,l=_.length;l>r;r++)b.push(m[m.id[r]].category.index[_[r]])
return this.Data(b)},e.prototype.toTable=function(t,e){if(null===this||"dataset"!==this["class"])return null
1==arguments.length&&"function"==typeof t&&(e=t,t=null)
var n=this.__tree__,t=t||{field:"label",content:"label",vlabel:"Value",slabel:"Status",type:"array",status:!1}
if("function"==typeof e){var i=this.toTable(t),r=[],s="array"!==t.type?0:1
if("object"!==t.type)var l=i.slice(s)
else var l=i.rows.slice(0)
for(var a=0,o=l.length;o>a;a++){var u=e.call(this,l[a],a)
void 0!==u&&r.push(u)}return"object"===t.type?{cols:i.cols,rows:r}:("array"===t.type&&r.unshift(i[0]),r)}if("arrobj"===t.type){for(var i=this.toTable({field:"id",content:t.content,status:t.status}),h=[],f=i.shift(),s=0,o=i.length;o>s;s++){for(var c={},d=i[s].length;d--;)c[f[d]]=i[s][d]
h.push(c)}return h}var v="id"===t.field
if("object"===t.type)var p="number"==typeof this.value[0]||null===this.value[0]?"number":"string",g=function(t,e){var n=v&&t||e||t
T.push({id:t,label:n,type:"string"})},y=function(t,e,n){var i=v&&"value"||t||"Value",r=v&&"status"||e||"Status"
n&&T.push({id:"status",label:r,type:"string"}),T.push({id:"value",label:i,type:p})},_=function(t){F.push({v:t})},b=function(t){F.push({v:t}),z.push({c:F})}
else var g=function(t,e){var n=v&&t||e||t
T.push(n)},y=function(t,e,n){var i=v&&"value"||t||"Value",r=v&&"status"||e||"Status"
n&&T.push(r),T.push(i),N.push(T)},_=function(t){F.push(t)},b=function(t){F.push(t),N.push(F)}
var m=n.dimension,w=m.id,O=w.length,x=m.size
if(O!=x.length)return!1
for(var S=[],k=1,P=1,D=[],j=[],J=[],N=[],T=[],z=[],s=0;O>s;s++){var V=w[s],q=m[V].label
g(V,q),k*=x[s],P*=x[s]
for(var C=[],d=0;d<x[s];d++)for(var R in m[w[s]].category.index)if(m[w[s]].category.index[R]===d){var X="id"!==t.content&&m[w[s]].category.label?m[w[s]].category.label[R]:R
C.push(X)}S.push(C),D.push(P)}y(t.vlabel,t.slabel,t.status)
for(var E=0,o=S.length;o>E;E++){for(var G=[],A=0,H=S[E].length;H>A;A++)for(var I=0;I<k/D[E];I++)G.push(S[E][A])
j.push(G)}for(var E=0,o=j.length;o>E;E++){for(var L=[],M=0,B=0;k>B;B++)L.push(j[E][M]),M++,M===j[E].length&&(M=0)
J.push(L)}for(var B=0;k>B;B++){for(var F=[],E=0,o=j.length;o>E;E++)_(J[E][B])
t.status&&_(this.status?this.status[B]:null),b(this.value[B])}return"object"===t.type?{cols:T,rows:z}:N},e.prototype.node=function(){return this.__tree__},e.prototype.toString=function(){return this["class"]},e.prototype.toValue=function(){return this.length},JSONstat.jsonstat=e}()
