var JSONstatUtils=function(){"use strict"
function e(e){function t(t){void 0!==e.selector?e.selector.innerHTML=u[t]:window.alert(u[t])}function r(e,t,r){var n={filter:{}}
return r.forEach(function(e){"rows"===e.name||"cols"===e.name?n[e.name]=e.value:n.filter[e.name]=e.value}),"rowscols"===t&&(n.filter={},e.id.forEach(function(t,r){t!==n.rows&&t!==n.cols&&(n.filter[t]=e.Dimension(r).id[0])})),n}function n(e){var t=e.id,r=t[0],n=t[1],o={}
e.Dimension(0).length<e.Dimension(1).length&&(r=t[1],n=t[0])
for(var i=2,l=t.length;l>i;i++)o[t[i]]=e.Dimension(i).id[0]
return{rows:r,cols:n,filter:o}}function o(e){var t=[],r=[].slice.call(e.querySelectorAll("select, input"))
return r.forEach(function(e){t.push({name:e.name,value:e.value})}),t}function i(e,t){var r=function(e,t){return e&&"metric"===e.role&&t.unit&&t.unit.hasOwnProperty("label")?" ("+t.unit.label+")":""}
return t.label.capitalize()+r(e,t)}function l(e,t,r){var n,o='<select name="'+t+'">',l=[]
if(null!==r[1]){if(n=e.id,l=e.Dimension(),2===n.length)return l[0].label}else{var a=e.Dimension(t)
if(n=a.id,l=a.Category(),1===n.length)return}return n.forEach(function(e,t){var n=e!==r[0]?"":'selected="selected" ';(null===r[1]||e!==r[1])&&(o+="<option "+n+'value="'+e+'">'+i(a,l[t])+"</option>")}),o+="</select>"}function a(e,t,n){var s="",c="",f="",v="",m=n.rows,g=t.Dimension(m),h=g.id,p=n.cols,y=t.Dimension(p),b=y.id,w=t.role&&t.role.metric?t.role.metric[0]:null,D=null!==w?t.Dimension(w):null,S=function(e){return e.hasOwnProperty("unit")&&e.unit&&e.unit.hasOwnProperty("decimals")?e.unit.decimals:null},E=n.filter,O=JSON.parse(JSON.stringify(E)),j=[],C="",L="",N=t.source?u.source+": "+t.source+".":"",R=null!==t.label?'<span class="label">'+t.label.capitalize()+"</span>":""
f+="<caption>"+R,f+=' <form><fieldset id="rowscols"><legend>'+u.rc+"</legend>"+l(t,"rows",[m,p])+" <a>&#x2194;</a> "+l(t,"cols",[p,m])+"</fieldset>"
for(var q in E){var A=t.Dimension(q),J=A.label.capitalize()
A.length>1?C+="<p>"+l(t,q,[E[q],null])+" <strong>"+J+"</strong></p>":j.push({label:J,value:i(A,A.Category(0)),name:q,id:A.id[0]})}""!==C&&(C='<fieldset id="filters"><legend>'+u.filters+"</legend>"+C+"</fieldset>"),j.forEach(function(e){L+="<p>"+e.value+" <strong>"+e.label+'</strong></p><input type="hidden" name="'+e.name+'" value="'+e.id+'" />'}),""!==L&&(L='<fieldset id="constants"><legend>'+u.constants+"</legend>"+L+"</fieldset>"),f+=C+L+"</form></caption>",v+="<tbody>"
var z=Number.toLocaleString?function(e,t){return null===t?e.toLocaleString(d):e.toLocaleString(d,{minimumFractionDigits:t,maximumFractionDigits:t})}:function(e,t){return null===t?e:e.toFixed(t)}
return h.forEach(function(e){O[m]=e
var r=t.Data(O),n=function(e,t){var r=p!==w?null===D?null:S(D.Category(O[w])):S(y.Category(t)),n=null!==e.value?z(e.value,r):e.status
v+="<td>"+n+"</td>"}
return null===r?void(v="ERROR"):(v+='<tr><th scope="row">'+i(g,g.Category(e))+"</th>","[object Array]"===Object.prototype.toString.call(r)?r.forEach(function(e,t){n(e,t)}):n(r,0),void(v+="</tr>"))}),"ERROR"===v?u.dataerror:(v+="</tbody>",s+="<thead><tr><th></th>",b.forEach(function(e){s+='<th scope="col">'+i(y,y.Category(e))+"</th>"}),s+="</tr></thead>",""!==N&&(c='<tfoot><tr><td colspan="'+(b.length+1)+'">'+N+"</td></tr></tfoot>"),e.innerHTML="<table>"+f+s+c+v+"</table>",[].slice.call(e.querySelectorAll("select")).forEach(function(n){n.addEventListener("change",function(n){a(e,t,r(t,n.target.parentElement.getAttribute("id"),o(e)))},!1)}),void e.querySelector("a").addEventListener("click",function(){n.cols=m,n.rows=p,a(e,t,n)},!1))}var s,c=function(e){for(var t=e.length,r=1;t--;)r*=e.Dimension(t).length
return r!==e.n?!1:!0},u=void 0===e.i18n||void 0===e.i18n.msgs?{selerror:'tbrowser: "selector" property is required!',urierror:'tbrowser: "jsonstat" property is required!',jsonerror:"Document is not valid JSON-stat.",dserror:"Dataset ID is not correct.",dimerror:"Only one dimension was found in the dataset. At least two are required.",dataerror:"Selection returned no data!",source:"Source",filters:"Filters",constants:"Constants",rc:"Rows &amp; Columns"}:e.i18n.msgs,d=void 0===e.i18n||void 0===e.i18n.locale?"en-US":e.i18n.locale,f=e.dsid||0
if(void 0===e.selector)return void t("selerror")
if(void 0===e.jsonstat)return void t("urierror")
if(s="string"==typeof e.jsonstat?JSONstat(e.jsonstat):void 0===e.jsonstat.length?JSONstat(e.jsonstat):e.jsonstat,0===s.length)return void t("jsonerror")
var v="dataset"===s["class"]?s:s.Dataset(f)
return c(v)?null===v?void t("dserror"):1===v.length?void t("dimerror"):void a(e.selector,v,n(v)):void t("jsonerror")}return String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},{tbrowser:e}}()
