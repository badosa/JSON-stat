/*

JSON-stat Javascript Toolkit v. 0.7.2
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
JSONstat.version="0.7.2",function(){"use strict"
function t(t){return"[object Array]"===Object.prototype.toString.call(t)}function e(e,n){function r(e,n){var r=[]
if("string"==typeof e&&(e=[e]),t(e)){if(e.length===n)return e
if(1===e.length){for(var i=0;n>i;i++)r.push(e[0])
return r}}for(var i=0;n>i;i++){var s=void 0===e[i]?null:e[i]
r.push(s)}return r}var i=function(t,e){var n,r=e!==!1
if(window.XDomainRequest&&/^(http(s)?:)?\/\//.test(t)){if(!r)return
var i=new XDomainRequest
i.onload=function(){n=JSON.parse(i.responseText),e.call(JSONstat(n))},i.open("GET",t),i.send()}else{var i=new XMLHttpRequest
if(i.onreadystatechange=function(){if(4===i.readyState){var t=i.status
n=t&&i.responseText&&(t>=200&&300>t||304===t)?JSON.parse(i.responseText):null,r&&e.call(JSONstat(n))}},i.open("GET",t,r),i.send(null),!r)return n}}
if(this.length=0,this.id=[],null!==e&&void 0!==e)switch(this.class=e.class||"bundle",this.class){case"bundle":var s=[],l=0
if(this.error=null,this.length=0,"string"==typeof e&&e.length>0&&(e=i(e,"function"==typeof n?n:!1)),null===e||"object"!=typeof e)return
if(e.hasOwnProperty("error"))return void(this.error=e.error)
for(var a in e)l++,s.push(a)
this.__tree__=e,this.length=l,this.id=s
break
case"dataset":e.hasOwnProperty("__tree__")||(delete e.class,e={__tree__:e})
var o=e.__tree__
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.updated=o.updated||null,this.source=o.source||null,this.extension=o.extension||null
var u=0
if(o.hasOwnProperty("value")&&t(o.value))u=o.value.length
else if(o.hasOwnProperty("status")&&t(o.status))u=o.status.length
else if(o.hasOwnProperty("dimension")){for(var h=o.dimension.size,f=1,v=h.length;v--;)f*=h[v]
u=f}if(this.value=r(o.value,u),this.status=o.hasOwnProperty("status")?r(o.status,u):null,o.hasOwnProperty("dimension")){if(!t(o.dimension.id)||!t(o.dimension.size)||o.dimension.id.length!=o.dimension.size.length)return
var d=o.dimension,c=d.role||null,p=d.id,g=d.size.length
if(this.length=g,this.id=p,this.role=c,c&&!c.hasOwnProperty("classification")){var y=[],_=c.time.concat(c.geo).concat(c.metric),b=function(t,e){for(var n=e.length;n--;)if(t===e[n])return!0
return!1}
this.role.classification=[]
for(var v=0;g>v;v++)b(p[v],_)||this.role.classification.push(p[v])}this.n=u
for(var y=0,m=this.length;m>y;y++)if(d[d.id[y]].category.hasOwnProperty("index")){if(t(d[d.id[y]].category.index)){for(var w={},O=d[d.id[y]].category.index,s=0,x=O.length;x>s;s++)w[O[s]]=s
d[d.id[y]].category.index=w}}else{var S=0
d[d.id[y]].category.index={}
for(var a in d[d.id[y]].category.label)d[d.id[y]].category.index[a]=S++}}else this.length=0
break
case"dimension":var P=[],o=e.__tree__,D=o.category
if(!e.hasOwnProperty("__tree__")||!o.hasOwnProperty("category"))return
if(!D.hasOwnProperty("label")){D.label={}
for(var a in D.index)D.label[a]=a}for(var a in D.index)P[D.index[a]]=a
this.__tree__=o,this.label=o.label||null,this.note=o.note||null,this.link=o.link||null,this.href=o.href||null,this.id=P,this.length=P.length,this.role=e.role,this.hierarchy=D.hasOwnProperty("child"),this.extension=o.extension||null
break
case"category":var j=e.child
this.id=j,this.length=null===j?0:j.length,this.index=e.index,this.label=e.label,this.note=e.note||null,this.unit=e.unit,this.coordinates=e.coord}}e.prototype.Dataset=function(t){if(null===this||"bundle"!==this.class)return null
if(void 0===t){for(var n=[],r=0,i=this.id.length;i>r;r++)n.push(this.Dataset(this.id[r]))
return n}if("number"==typeof t){var s=this.id[t]
return void 0!==s?this.Dataset(s):null}var l=this.__tree__[t]
return void 0===l?null:new e({"class":"dataset",__tree__:l})},e.prototype.Dimension=function(t){function n(t,e){var n=t.role
if(void 0!==n)for(var r in n)for(var i=n[r].length;i--;)if(n[r][i]===e)return r
return null}if(null===this||"dataset"!==this.class)return null
if(void 0===t){for(var r=[],i=0,s=this.id.length;s>i;i++)r.push(this.Dimension(this.id[i]))
return r}if("number"==typeof t){var l=this.id[t]
return void 0!==l?this.Dimension(l):null}var a=this.__tree__.dimension
if(void 0===a)return null
if("object"==typeof t){if(t.hasOwnProperty("role")){for(var r=[],i=0,s=this.id.length;s>i;i++){var o=this.id[i]
n(a,o)===t.role&&r.push(this.Dimension(o))}return void 0===r[0]?null:r}return null}var u=a[t]
return void 0===u?null:new e({"class":"dimension",__tree__:u,role:n(a,t)})},e.prototype.Category=function(t){if(null===this||"dimension"!==this.class)return null
if(void 0===t){for(var n=[],r=0,i=this.id.length;i>r;r++)n.push(this.Category(this.id[r]))
return n}if("number"==typeof t){var s=this.id[t]
return void 0!==s?this.Category(s):null}var l=this.__tree__.category
if(void 0===l)return null
var a=l.index[t]
if(void 0===a)return null
var o=l.unit&&l.unit[t]||null,u=l.coordinates&&l.coordinates[t]||null,h=l.child&&l.child[t]||null,f=l.note&&l.note[t]||null
return new e({"class":"category",index:a,label:l.label[t],note:f,child:h,unit:o,coord:u})},e.prototype.Data=function(e){function n(t){for(var e in t)if(t.hasOwnProperty(e))return e}function r(t,e){for(var r=[],i=t.dimension,s=i.id,l=0,a=s.length;a>l;l++){var o=s[l],u=e[o]
r.push("string"==typeof u?u:1===i.size[l]?n(i[o].category.index):null)}return r}if(null===this||"dataset"!==this.class)return null
if(void 0===e){for(var i=0,s=[],l=this.value.length;l>i;i++)s.push(this.Data(i))
return s}if("number"==typeof e){var a=this.value[e]
return void 0!==a?{value:a,status:this.status?this.status[e]:null}:null}var o=this.__tree__,u=o.dimension.size,h=u.length
if(t(e)){if(this.length!==e.length)return null
for(var f=1,v=0,d=[],c=[],s=[],i=0;h>i;i++)if(void 0!==e[i]){if("number"!=typeof e[i]||e[i]>=u[i])return null
f*=i>0?u[h-i]:1,v+=f*e[h-i-1]}else d.push(i),c.push(u[i])
if(d.length>1)return null
if(1===d.length){for(var p=0,g=c[0];g>p;p++){for(var y=[],i=0;h>i;i++)y.push(i!==d[0]?e[i]:p)
s.push(this.Data(y))}return s}return{value:this.value[v],status:this.status?this.status[v]:null}}for(var _=r(o,e),b=[],m=o.dimension,i=0,l=_.length;l>i;i++)b.push(m[m.id[i]].category.index[_[i]])
return this.Data(b)},e.prototype.toTable=function(t,e){if(null===this||"dataset"!==this.class)return null
1==arguments.length&&"function"==typeof t&&(e=t,t=null)
var n=this.__tree__,t=t||{field:"label",content:"label",vlabel:"Value",slabel:"Status",type:"array",status:!1}
if("function"==typeof e){var r=this.toTable(t),i=[],s="array"!==t.type?0:1
if("object"!==t.type)var l=r.slice(s)
else var l=r.rows.slice(0)
for(var a=0,o=l.length;o>a;a++){var u=e.call(this,l[a],a)
void 0!==u&&i.push(u)}return"object"===t.type?{cols:r.cols,rows:i}:("array"===t.type&&i.unshift(r[0]),i)}if("arrobj"===t.type){for(var r=this.toTable({field:"id",content:t.content,status:t.status}),h=[],f=r.shift(),s=0,o=r.length;o>s;s++){for(var v={},d=r[s].length;d--;)v[f[d]]=r[s][d]
h.push(v)}return h}var c="id"===t.field
if("object"===t.type)var p="number"==typeof this.value[0]||null===this.value[0]?"number":"string",g=function(t,e){var n=c&&t||e||t
k.push({id:t,label:n,type:"string"})},y=function(t,e,n){var r=c&&"value"||t||"Value",i=c&&"status"||e||"Status"
n&&k.push({id:"status",label:i,type:"string"}),k.push({id:"value",label:r,type:p})},_=function(t){I.push({v:t})},b=function(t){I.push({v:t}),z.push({c:I})}
else var g=function(t,e){var n=c&&t||e||t
k.push(n)},y=function(t,e,n){var r=c&&"value"||t||"Value",i=c&&"status"||e||"Status"
n&&k.push(i),k.push(r),T.push(k)},_=function(t){I.push(t)},b=function(t){I.push(t),T.push(I)}
var m=n.dimension,w=m.id,O=w.length,x=m.size
if(O!=x.length)return!1
for(var S=[],P=1,D=1,j=[],J=[],N=[],T=[],k=[],z=[],s=0;O>s;s++){var V=w[s],q=m[V].label
g(V,q),P*=x[s],D*=x[s]
for(var C=[],d=0;d<x[s];d++)for(var R in m[w[s]].category.index)if(m[w[s]].category.index[R]===d){var X="id"!==t.content&&m[w[s]].category.label?m[w[s]].category.label[R]:R
C.push(X)}S.push(C),j.push(D)}y(t.vlabel,t.slabel,t.status)
for(var E=0,o=S.length;o>E;E++){for(var G=[],A=0,H=S[E].length;H>A;A++)for(var L=0;L<P/j[E];L++)G.push(S[E][A])
J.push(G)}for(var E=0,o=J.length;o>E;E++){for(var M=[],B=0,F=0;P>F;F++)M.push(J[E][B]),B++,B===J[E].length&&(B=0)
N.push(M)}for(var F=0;P>F;F++){for(var I=[],E=0,o=J.length;o>E;E++)_(N[E][F])
t.status&&_(this.status?this.status[F]:null),b(this.value[F])}return"object"===t.type?{cols:k,rows:z}:T},e.prototype.node=function(){return this.__tree__},e.prototype.toString=function(){return this.class},e.prototype.toValue=function(){return this.length},JSONstat.jsonstat=e}()
