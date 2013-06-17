/* 

JSON-stat Javascript Toolkit v. 0.4.2
http://json-stat.org
https://github.com/badosa/JSON-stat

Copyright 2013 Xavier Badosa (http://xavierbadosa.com)

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

var JSONstat = JSONstat || {};

JSONstat.version="0.4.2";

function JSONstat(resp,f){
	if(window===this){
		return new JSONstat.jsonstat(resp,f);
	}
}

(function(){
	"use strict";
	function isArray(o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	}
	//Check availability as a last step (after sparse cube problem, which is treated at dimension level (normalize). Support for ["a"] and "a".
	//Used by Data() and toTable(), that is: always after Dataset(): e.value (this.value) is defined but not used in current implementation.
	//Using s.length>0 means that if value and status have length different it will assume last values have undefined statuses
	function getStatus(e,i){
		var s=e.status;
		if(s!==null){
			if(isArray(s)){
				//instead of e.value.length===s.length
				return (s.length>1) ? s[i] : s[0];
				//No status for all obs was provided: it means same for all
			}
			if(typeof s==="string"){ //A string? It means same status for all
				return s;
			}
		}
		return null;
	}
	function jsonstat(o,f){
		var xhr=function(uri, func){
			var json, async=(func!==false);
			if(window.XDomainRequest && /^(http(s)?:)?\/\//.test(uri)){ //IE9 cross-domain (assuming access to some domain won't be specified using an absolute address). Not integrated because it'll will be removed someday...
				if(!async){
					//console.log("JSONstat: IE9 sync cross-domain request? Sorry, not supported (only async if IE9 and cross-domain).");
					return;
				}
				var req=new XDomainRequest();
				req.onerror=function(){
					console.log("JSONstat: Can't access "+uri);
				}
				req.onload=function(){
					json=JSON.parse(req.responseText);
					func.call(JSONstat(json));
				}
				req.open("GET", uri);
				req.send();
			}else{ //Standard xhr
				var req=new XMLHttpRequest();
				req.onreadystatechange=function(){
					if(req.readyState===4){
						var s=req.status;
						json=(s && req.responseText && (s>=200 && s<300 || s===304)) ? JSON.parse(req.responseText) : null;
						if(async){
							func.call(JSONstat(json));
						}
					}
				}
				req.open("GET",uri,async);
				req.send(null);
				if(!async){
					return json;
				}
			}
		}
		//sparse cube (value or status)
		function normalize(s,len){
			var ret=[];

			//if string, leave it alone (instead of return [s]): getStatus will take care of it
			if(isArray(s) || typeof s==="string"){
				return s;
			}

			//It's an object (sparse cube)
			for(var l=0; l<len; l++){
				var e=(typeof s[l]==="undefined") ? null: s[l];
				ret.push(e);
			}
			return ret;
		}

		this.length=0;
		this.id=[];
		if (o===null || typeof o==="undefined"){
			return;
		}
		var type=o.type||"root";
		switch(type){
			case "root" :
				this.type="root";
				var i=[], ds=0;

				//URI assumed
				if (typeof o==="string" && o.length>0){
					o=xhr(o, typeof f==="function"? f : false);//If second argument is function then async
				}

				// Wrong input object or wrong URI o connection problem
				if(o===null || typeof o!=="object"){
					return;
				}

				for (var prop in o){
					ds++;
					/* If sparse cube, we can't rely on value to check size
					if (isArray(o[prop].value)){
						a++;
					}
					*/
					i.push(prop);
				}
				this.__tree__=o;
				this.length=ds;
				this.id=i;
			break;
			case "ds" :
				this.type="ds";
				if (!o.hasOwnProperty("__tree__")){
					return;
				}
				var ot=o.__tree__;
				this.__tree__=ot;
				this.label=o.label;
				this.updated=o.updated;

				//Sparse cube (If toTable() removed, this logic can be moved inside Data()
				//which is more efficient when retrieving a single value/status.
				var dsize=0; //data size
				if (ot.hasOwnProperty("value") && isArray(ot.value)){
					dsize=ot.value.length;
				}else{
					if (ot.hasOwnProperty("status") && isArray(ot.status)){
						dsize=ot.status.length;
					}else{
						if(ot.hasOwnProperty("dimension")) {
							var size=this.__tree__.dimension.size, length=1;
							for(var s=size.length; s--;){
								length*=size[s];
							}
							dsize=length;
						}
					}
				}

				this.value=normalize(ot.value,dsize);
				if(!(ot.hasOwnProperty("status"))){
					this.status=null;
				}else{
					this.status=normalize(ot.status,dsize);
				}
				
				// if dimensions are defined, id and size arrays are required and must have equal length
				if (ot.hasOwnProperty("dimension")){
					if (
						!(isArray(ot.dimension.id)) || 
						!(isArray(ot.dimension.size)) ||
						ot.dimension.id.length!=ot.dimension.size.length
						){
						return;
					}
					var otd=ot.dimension;
					this.length=otd.size.length;
					this.id=otd.id;
					this.role=otd.role; //0.3.5 Role added
					this.n=dsize; //number of obs added in 0.4.2

					//If only one category, no need of index according to the spec
					//This actually will recreate an index even if there are more than one category and no index is provided
					//but because there's no guarantee that properties are retrieved in a particular order (even though it worked in Ch,FF,IE,Sa,Op)
					//(Main problem in fact is that you don't have to WRITE them in a particular order) the original order of categories could 
					//theoretically be changed. That's why the procedure will only be valid when there's only one category.
					//Note: If toTable() is removed it would make more sense to move this loop inside Dimension() as it is not needed for Data().
					for(var d=0, len=this.length; d<len; d++){
						if (!(otd[otd.id[d]].category.hasOwnProperty("index"))){
							var c=0;
							otd[otd.id[d]].category.index={};
							for (var prop in otd[otd.id[d]].category.label){
								otd[otd.id[d]].category.index[prop]=c++;
							}
						}else{
							// If index is array instead of object convert into object
							// That is: we normalize it (instead of defining a function depending on
							// index type to read categories -maybe in the future when indexOf can be
							// assume for all browsers and default is array instead of object-)
							if(isArray(otd[otd.id[d]].category.index)){
								var oindex={}, index=otd[otd.id[d]].category.index;
								for (var i=0, len=index.length; i<len; i++){
									oindex[index[i]]=i;
								}
								otd[otd.id[d]].category.index=oindex;
							}
						}
					}
				}else{
					this.length=0;
				}
			break;
			case "dim" :
				this.type="dim";
				var cats=[], ot=o.__tree__, otc=ot.category;
				if (
					!o.hasOwnProperty("__tree__") ||
					!ot.hasOwnProperty("category") //Already tested in the Dimension() / Category() ? method
					){
					return;
				}

				//If no category label, use IDs
				if(!otc.hasOwnProperty("label")){
					otc.label={};
					for (var prop in otc.index){
						otc.label[prop]=prop;
					}
				}

				//Array conversion
				for (var prop in otc.index){
					cats.push(prop);
				}

				this.__tree__=ot;
				this.label=o.label;
				this.id=cats;
				this.length=cats.length;
				this.role=o.role;
			break;
			case "cat" :
				this.type="cat";
				this.length=0;
				this.id=o.id; //unneeded: just to have id length and label everywhere
				this.index=o.index;
				this.label=o.label;
				this.__tree__=o.__tree__;
		}
	}

	jsonstat.prototype.Dataset=function(ds){
		if (this===null){
			return null;
		}
		if(typeof ds==="undefined"){
			var ar=[];
			for(var c=0, len=this.id.length; c<len; c++){
				ar.push(this.Dataset(this.id[c]));
			}
			return ar;
		}
		if(typeof ds==="number"){
			return this.Dataset(this.id[ds]);
		}

		var tds=this.__tree__[ds];
		if(typeof tds==="undefined"){
			return null;
		}

		return new jsonstat({"label" : tds.label, "updated" : tds.updated, "type" : "ds", "__tree__": tds});
	}

	jsonstat.prototype.Dimension=function(dim){
		function role(otd,dim){
			var otdd=otd[dim], otdr=otd.role;
			if(typeof otdr!="undefined"){
				for(var prop in otdr){
					for(var p=otdr[prop].length;p--;){
						if(otdr[prop][p]===dim){
							return prop;
						}
					}
				}
			}
			return null;
		}

		if (this===null){
			return null;
		}
		if(typeof dim==="undefined"){
			var ar=[];
			for(var c=0, len=this.id.length; c<len; c++){
				ar.push(this.Dimension(this.id[c]));
			}
			return ar;
		}
		if(typeof dim==="number"){
			return this.Dimension(this.id[dim]);
		}

		var otd=this.__tree__.dimension;
		if(typeof otd==="undefined"){
			return null;
		}

		//currently only role is supported as filter criterion
		if(typeof dim==="object" && dim.hasOwnProperty("role")){
			var ar=[];
			for(var c=0, len=this.id.length; c<len; c++){
				var oid=this.id[c];
				if(role(otd,oid)===dim.role){
					ar.push(this.Dimension(oid));
				}
			}
			return ar;
		}

		var otdd=otd[dim];
		if(typeof otdd==="undefined"){
			return null;
		}

		//When no dimension label, undefined is returned.
		//Discarded options: null / dim
		//var label=(typeof otdd.label!=="undefined") ? otdd.label : null;
		//var label=(typeof otdd.label!=="undefined") ? otdd.label : dim;
		return new jsonstat({"__tree__": otdd, "label" : otdd.label, "role": role(otd,dim), "type" : "dim"});
	}

	jsonstat.prototype.Category=function(cat){
		if(this===null){
			return null;
		}
		if(typeof cat==="undefined"){
			var ar=[];
			for(var c=0, len=this.id.length; c<len; c++){
				ar.push(this.Category(this.id[c]));
			}
			return ar;
		}
		if(typeof cat==="number"){
			return this.Category(this.id[cat]);
		}
		var oc=this.__tree__.category;
		if(typeof oc==="undefined"){
			return null;
		}
		return new jsonstat({"index": oc.index[cat], "label": oc.label[cat], "__tree__" : null, "type" : "cat", "id" : cat});
	}

	//Validations, pending
	jsonstat.prototype.Data=function(e){
		//DataById {"sex" : "M", "age" : "A", "ter": "B"}).value -> value or undefined
		function firstprop(o){
			for (var p in o) {
				if(o.hasOwnProperty(p)){
					return p;
				}
			}
		}
		function dimObj2Array(thisds, obj){
			var a=[], dim=thisds.dimension, di=dim.id;
			for (var d=0, len=di.length; d<len; d++){
				var id=di[d], cat=obj[id];
				//If dimension not defined and dim size=1, take first category (user not forced to specify single cat dimensions)
				a.push(typeof cat==="string" ? cat : dim.size[d]===1 ? firstprop(dim[id].category.index) : null);
			}
			return a;
		}

		var tree=this.__tree__, n=tree.dimension.size, dims=n.length //same as this.length;
		if(this===null || typeof tree==="undefined"){
			return null;
		}

		if(typeof e==="undefined"){
			//Before 0.4.2
			//return {"value" : this.value, "status": this.status, "label": tree.label, "length" : this.value.length};
			//Since 0.4.2: normalized as array of objects
			for(var i=0, ret=[], len=this.value.length; i<len; i++){
				ret.push(this.Data(i));
			}
			return ret;
		}

		//Data By Position in original array
		if(typeof e==="number"){
			return (e<this.n) ? {"value" : this.value[e] , "status": getStatus(this,e), length: 1} : {"value" : undefined, "status": undefined, "length" : 0};//To do: add more metada...
		}

		//DataByPosition in every dim
		//If more positions than needed are provided, they will be ignored.
		//Less positions than needed will return undefined
		if(isArray(e)){
			var mult=1,
				  m=[],
				  res=0,
				  miss=[],
				  nmiss=[],
				  ret=[]
			;
			//Validate dim index
			//And loop to find missing dimensions
			for(var i=0; i<dims; i++){
				if(typeof e[i]!=="undefined"){
					if(typeof e[i]!=="number" || e[i]>=n[i]){
						return {"value" : undefined, "status": undefined, "length" : 0};//To do: add more metada...
					}
					//Used if normal case (miss.length===0)
					mult*=(i>0) ? n[(dims-i)] : 1;
					m.push(mult);
				}else{
					//Used is missing dimensions miss.length>0
					miss.push(i); //missing dims
					nmiss.push(n[i]); //missing dims size
				}
			}

			//If all dims are specified, go ahead as usual.
			//If one non-single dimension is missing create array of results
			//If more than one non-single dimension is missing, WARNING
			if(miss.length>1){
				return {"value" : undefined, "status": undefined, "length" : 0};//To do: add more metada...
			}
			if(miss.length===1){
				for(var c=0, clen=nmiss[0]; c<clen; c++){
					var na=[]; //new array
					for(var i=0; i<dims; i++){
						if(i!==miss[0]){
							na.push(e[i]);
						}else{
							na.push(c);
						}
					}
					ret.push(this.Data(na));
				}
				return ret;
			}

			//miss.length===0
			for(var i=dims; i--;){
				res+=m[i]*e[dims-i-1];
			}
			return {"value" : this.value[res], "status": getStatus(this,res), "length" : 1};//To do: add more metada...
		}

		var id=dimObj2Array(tree, e);
		var pos=[], otd=tree.dimension;
		for(var i=0, len=id.length; i<len; i++){
			pos.push(otd[otd.id[i]].category.index[id[i]]);
		}
		//Dimension cat undefined means a loop (by position) is necessary
		return this.Data(pos);
	}

	/* 
		Transformation method: output in DataTable format (array or object)
		Setup: opts={status: false, slabel: "Status", vlabel: "Value", field: "label", content: "label", type: "array"} (type values: "array" / "object" / "arrobj")

		PENDING: use metric or any dim cat IDs instead of "value" and assign as many fields as metrics (pivot "by").
	*/
	jsonstat.prototype.toTable=function(opts, func){
		if (typeof this.__tree__==="undefined"){
			return null;
		}
		if(arguments.length==1 && typeof opts==="function"){
			func=opts, opts=null;
		}
		var
			dataset=this.__tree__,
			opts=opts || {field: "label", content: "label", vlabel: "Value", slabel: "Status", type: "array", status: false} //default: use label for field names and content instead of "id"
		;

		if(typeof func==="function"){
			var 
				totbl=this.toTable(opts),
				ret=[],
				i=(opts.type!=='array') ? 0 : 1 //first row is header in array and object 
			;

			if(opts.type!=='object'){
				var arr=totbl.slice(i);
			}else{
				var arr=totbl.rows.slice(0);
			}

			for(var r=0, len=arr.length; r<len; r++){
				var a=func.call(
					null,
					arr[r], //Discarded for efficiency: (opts.type!=='object') ? arr[r] : arr[r].c,
					r
				);
				if (typeof a!=="undefined"){
					ret.push(a);
				}
			}
			if (opts.type==='object'){
				return {cols: totbl.cols, rows: ret};
			}
			if(opts.type==='array'){
				ret.unshift(totbl[0]);
			}
			return ret;
		}

		//For example, as D3 input
		if(opts.type==="arrobj"){
			var 
				totbl=this.toTable({field: "id", content: opts.content, status: opts.status}),// At the moment, options besides "type" are not passed
				tbl=[],
				head=totbl.shift()
			;

			for(var i=0, len=totbl.length; i<len; i++){ //Can't be done with i-- as we want to keep the original order
				var tblr={};
				for(var j=totbl[i].length;j--;){
					tblr[head[j]]=totbl[i][j];
				}
				tbl.push(tblr);
			}
			return tbl;
		}

		var useid=(opts.field==="id");

		if(opts.type==="object"){
			//Object
			var 
				addCol=function(dimid,dimlabel){
					var label=(useid && dimid) || dimlabel || dimid; //if userid then id; else label; then id if not label
					cols.push({id: dimid, label: label, type: "string"}); //currently not using datetime Google type (requires a Date object)
				},
				addColValue=function(str1,str2,status){
					var
						vlabel=(useid && "value") || str1|| "Value",
						slabel=(useid && "status") || str2|| "Status"
					;
					if(status){
						cols.push({id: "status", label: slabel, type: "string"});
					}
					cols.push({id: "value", label: vlabel, type: "number"});
				},
				addRow=function(r){
					row.push({v: r});
				},
				addRowValue=function(r){
					//At the moment, no support for formatted values (f: formatted)
					row.push({v: r});
					rows.push({c: row});
				}
			;
		}else{
			//Array
			var
				addCol=function(dimid,dimlabel){
					var colid=(useid && dimid) || dimlabel || dimid; //if userid then id; else label; then id if not label
					cols.push(colid);
				},
				addColValue=function(str1,str2,status){
					var
						vlabel=(useid && "value") || str1 || "Value",
						slabel=(useid && "status") || str2 || "Status"
					;
					if(status){
						cols.push(slabel);
					}
					cols.push(vlabel);
					table.push(cols);
				},
				addRow=function(r){
					row.push(r);
				},
				addRowValue=function(r){
					row.push(r);
					table.push(row);
				}
			;
		}

		var dd=dataset.dimension, ddi=dd.id, ddil=ddi.length, dds=dd.size;
		if (ddil!=dds.length){
			return false;
		}
		var dim=[], total=1, m=1, mult=[], dimexp=[], label=[], table=[], cols=[], rows=[];
		for (var i=0; i<ddil; i++){
			var	dimid=ddi[i],
					dimlabel=dd[dimid].label
			;
			addCol(dimid,dimlabel); //Global cols

			total*=dds[i];
			m*=dds[i];
			var cat=[];
			for (var j=0; j<dds[i]; j++){
				for (var catid in dd[ddi[i]].category.index){
					if (dd[ddi[i]].category.index[catid]===j){
						var rowid=(opts.content!=="id" && dd[ddi[i]].category.label) ? dd[ddi[i]].category.label[catid] : catid; //id if not label (Maybe move label normalization from "dim" to "ds"?)
						cat.push(rowid);
					}
				}
			}
			dim.push(cat);
			mult.push(m);
		}
		addColValue(opts.vlabel,opts.slabel,opts.status); //Global cols and table

		//end of inversion: now use dim array
		for (var d=0, len=dim.length; d<len; d++){
			var catexp=[];
			for (var c=0, len2=dim[d].length; c<len2; c++){
				//get the label repetitions
				for (var n=0; n<total/mult[d]; n++){
					catexp.push(dim[d][c]);
				}
			}
			dimexp.push(catexp);
		}
		for (var d=0, len=dimexp.length; d<len; d++){
			var l=[], e=0;
			for (var x=0; x<total; x++){
				l.push(dimexp[d][e]);
				e++;
				if (e===dimexp[d].length){
					e=0;
				}
			}
			label.push(l);
		}
		for (var x=0; x<total; x++){
			var row=[];
			for (var d=0, len=dimexp.length; d<len; d++){
				addRow(label[d][x]); //Global row
			}
			if(opts.status){
				addRow(getStatus(this,x)); //0.3.7
			}
			addRowValue(this.value[x]); //Global row, rows and table
		}

		if(opts.type==="object"){
			return {cols: cols, rows: rows};
		}else{
			return table;
		}
	}

	jsonstat.prototype.node=function(){
		return this.__tree__;
	}

	jsonstat.prototype.toString=function(){
		return this.type; //improve?
	}
	jsonstat.prototype.toValue=function(){
		return this.length;
	}

	JSONstat.jsonstat=jsonstat;
})();