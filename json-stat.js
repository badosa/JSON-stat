/*

JSON-stat Javascript Toolkit v. 0.7.5
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
JSONstat.version="0.7.5",function(){"use strict"
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
if("dataset"===e["class"])return JSONstat(e)
if(e.hasOwnProperty("error"))return void(this.error=e.error)
for(var a in e)l++,s.push(a)
this.__tree__=e,this.length=l,this.id=s
break
case"dataset":e.hasOwnProperty("__tree__")||(delete e["class"],e={__tree__:e})
var o=e.__tree__
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.updated=o.updated||null,this.source=o.source||null,this.extension=o.extension||null
var u=0
if(o.hasOwnProperty("value")&&t(o.value))u=o.value.length
else if(o.hasOwnProperty("status")&&t(o.status))u=o.status.length
else if(o.hasOwnProperty("dimension")){for(var h=o.dimension.size,f=1,v=h.length;v--;)f*=h[v]
u=f}if(this.value=i(o.value,u),this.status=o.hasOwnProperty("status")?i(o.status,u):null,o.hasOwnProperty("dimension")){if(!t(o.dimension.id)||!t(o.dimension.size)||o.dimension.id.length!=o.dimension.size.length)return
var d=o.dimension,c=d.role||null,p=d.id,g=d.size.length,y=function(t){c.hasOwnProperty(t)||(c[t]=null)}
if(this.length=g,this.id=p,c&&(y("time"),y("geo"),y("metric"),y("classification")),c&&null===c.classification){for(var _=[],b=function(t,e){for(var n=e.length;n--;)if(t===e[n])return!0
return!1},v=0,m=["time","geo","metric"];3>v;v++){var w=c[m[v]]
null!==w&&(_=_.concat(w))}c.classification=[]
for(var v=0;g>v;v++)b(p[v],_)||c.classification.push(p[v])
0===c.classification.length&&(c.classification=null)}this.role=c,this.n=u
for(var O=0,x=this.length;x>O;O++)if(d[d.id[O]].category.hasOwnProperty("index")){if(t(d[d.id[O]].category.index)){for(var S={},P=d[d.id[O]].category.index,s=0,D=P.length;D>s;s++)S[P[s]]=s
d[d.id[O]].category.index=S}}else{var j=0
d[d.id[O]].category.index={}
for(var a in d[d.id[O]].category.label)d[d.id[O]].category.index[a]=j++}}else this.length=0
break
case"dimension":var J=[],o=e.__tree__,N=o.category
if(!e.hasOwnProperty("__tree__")||!o.hasOwnProperty("category"))return
if(!N.hasOwnProperty("label")){N.label={}
for(var a in N.index)N.label[a]=a}for(var a in N.index)J[N.index[a]]=a
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.id=J,this.length=J.length,this.role=e.role,this.hierarchy=N.hasOwnProperty("child"),this.extension=o.extension||null
break
case"category":var T=e.child
this.id=T,this.length=null===T?0:T.length,this.index=e.index,this.label=e.label,this.note=e.note||null,this.unit=e.unit,this.coordinates=e.coord}}e.prototype.Dataset=function(t){if(null===this||"bundle"!==this["class"])return null
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
for(var f=1,v=0,d=[],c=[],s=[],r=0;h>r;r++)if(void 0!==e[r]){if("number"!=typeof e[r]||e[r]>=u[r])return null
f*=r>0?u[h-r]:1,v+=f*e[h-r-1]}else d.push(r),c.push(u[r])
if(d.length>1)return null
if(1===d.length){for(var p=0,g=c[0];g>p;p++){for(var y=[],r=0;h>r;r++)y.push(r!==d[0]?e[r]:p)
s.push(this.Data(y))}return s}return{value:this.value[v],status:this.status?this.status[v]:null}}for(var _=i(o,e),b=[],m=o.dimension,r=0,l=_.length;l>r;r++)b.push(m[m.id[r]].category.index[_[r]])
return this.Data(b)},e.prototype.toTable=function(t,e){if(null===this||"dataset"!==this["class"])return null
1==arguments.length&&"function"==typeof t&&(e=t,t=null)
var n=this.__tree__,t=t||{field:"label",content:"label",vlabel:"Value",slabel:"Status",type:"array",status:!1}
if("function"==typeof e){var i=this.toTable(t),r=[],s="array"!==t.type?0:1
if("object"!==t.type)var l=i.slice(s)
else var l=i.rows.slice(0)
for(var a=0,o=l.length;o>a;a++){var u=e.call(this,l[a],a)
void 0!==u&&r.push(u)}return"object"===t.type?{cols:i.cols,rows:r}:("array"===t.type&&r.unshift(i[0]),r)}if("arrobj"===t.type){for(var i=this.toTable({field:"id",content:t.content,status:t.status}),h=[],f=i.shift(),s=0,o=i.length;o>s;s++){for(var v={},d=i[s].length;d--;)v[f[d]]=i[s][d]
h.push(v)}return h}var c="id"===t.field
if("object"===t.type)var p="number"==typeof this.value[0]||null===this.value[0]?"number":"string",g=function(t,e){var n=c&&t||e||t
k.push({id:t,label:n,type:"string"})},y=function(t,e,n){var i=c&&"value"||t||"Value",r=c&&"status"||e||"Status"
n&&k.push({id:"status",label:r,type:"string"}),k.push({id:"value",label:i,type:p})},_=function(t){I.push({v:t})},b=function(t){I.push({v:t}),z.push({c:I})}
else var g=function(t,e){var n=c&&t||e||t
k.push(n)},y=function(t,e,n){var i=c&&"value"||t||"Value",r=c&&"status"||e||"Status"
n&&k.push(r),k.push(i),T.push(k)},_=function(t){I.push(t)},b=function(t){I.push(t),T.push(I)}
var m=n.dimension,w=m.id,O=w.length,x=m.size
if(O!=x.length)return!1
for(var S=[],P=1,D=1,j=[],J=[],N=[],T=[],k=[],z=[],s=0;O>s;s++){var V=w[s],q=m[V].label
g(V,q),P*=x[s],D*=x[s]
for(var C=[],d=0;d<x[s];d++)for(var R in m[w[s]].category.index)if(m[w[s]].category.index[R]===d){var X="id"!==t.content&&m[w[s]].category.label?m[w[s]].category.label[R]:R
C.push(X)}S.push(C),j.push(D)}y(t.vlabel,t.slabel,t.status)
for(var E=0,o=S.length;o>E;E++){for(var G=[],A=0,H=S[E].length;H>A;A++)for(var L=0;L<P/j[E];L++)G.push(S[E][A])
J.push(G)}for(var E=0,o=J.length;o>E;E++){for(var M=[],B=0,F=0;P>F;F++)M.push(J[E][B]),B++,B===J[E].length&&(B=0)
N.push(M)}for(var F=0;P>F;F++){for(var I=[],E=0,o=J.length;o>E;E++)_(N[E][F])
t.status&&_(this.status?this.status[F]:null),b(this.value[F])}return"object"===t.type?{cols:k,rows:z}:T},e.prototype.node=function(){return this.__tree__},e.prototype.toString=function(){return this["class"]},e.prototype.toValue=function(){return this.length},JSONstat.jsonstat=e}()
