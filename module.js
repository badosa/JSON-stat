/*

JSON-stat Javascript Toolkit v. 0.7.4 (Node.js module)
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

var JSONstat = JSONstat || {};

JSONstat.version="0.7.4";

function JSONstat(resp,f){
	return new JSONstat.jsonstat(resp,f); //nodejs
}

(function(){
	"use strict";
	function isArray(o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	}
	function jsonstat(o,f){
		//nodejs xhr gone
		//sparse cube (value or status)
		//If only one value/status is provided it means same for all (if more than one, then missing values/statuses are nulled).
		function normalize(s,len){
			var ret=[];

			if(typeof s==="string"){
				s=[s];
			}
			if(isArray(s)){
				if(s.length===len){ //normal case
					return s;
				}
				if(s.length===1){ //all obs same status
					for(var l=0; l<len; l++){
						ret.push(s[0]);
					}
					return ret;
				}
			}

			//It's an object (sparse cube) or an incomplete array that must be filled with nulls
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

		this.class=o.class || "bundle";
		switch(this.class){
			case "bundle" :
				var i=[], ds=0;
				this.error=null;
				this.length=0;

				//URI assumed
				if(typeof o==="string"){
					console.log("Module does not accept a URI string, must be an object."); //nodejs
				}

				// Wrong input object or wrong URI or connection problem
				if(o===null || typeof o!=="object"){
					return;
				}

				// Explicit error
				if(o.hasOwnProperty("error")){
					this.error=o.error;
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

			case "dataset" :
				//It's a native response of class "dataset"
				if (!o.hasOwnProperty("__tree__")){
					delete o.class; //class shouldn't go inside __tree__
					o={ "__tree__": o }; //remove all elements from o (native response "dataset"), put everything inside __tree__  (native response "bundle")
				}

				var ot=o.__tree__;
				this.__tree__=ot;
				this.label=ot.label || null;
				this.note=ot.note || null; //v.0.7.0
				this.link=ot.link || null; //v.0.7.0
				this.href=ot.href || null; //v.0.7.0
				this.updated=ot.updated || null;
				this.source=ot.source || null; //v.0.5.0
				this.extension=ot.extension || null; //v.0.7.0

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
							var size=ot.dimension.size, length=1;
							for(var s=size.length; s--;){
								length*=size[s];
							}
							dsize=length;
						}
					}
				}

				this.value=normalize(ot.value,dsize);
				this.status=(!(ot.hasOwnProperty("status"))) ? null : normalize(ot.status,dsize);

				// if dimensions are defined, id and size arrays are required and must have equal length
				if (ot.hasOwnProperty("dimension")){
					if (
						!(isArray(ot.dimension.id)) ||
						!(isArray(ot.dimension.size)) ||
						ot.dimension.id.length!=ot.dimension.size.length
						){
						return;
					}
					var 
						otd=ot.dimension,
						otr=otd.role || null,
						otdi=otd.id,
						otdl=otd.size.length,
						createRole=function(s){
							if(!otr.hasOwnProperty(s)){
								otr[s]=null;
							}
						}
					;

					this.length=otdl;
					this.id=otdi;

					if(otr){
						createRole("time");
						createRole("geo");
						createRole("metric");
						createRole("classification");
					}

					//If role not null, leave it as it is but add a classification role if it's null. Added in 0.7.1
					if (otr && otr.classification===null){
						var 
							gmt=[],
							//Replace with polyfill of Array.indefOf at some point?
							inArray=function(e, a){
								for(var i=a.length;i--;){
									if(e===a[i]){
										return true;
									}
								}
								return false;
							}
						;

						for(var s=0, roles=["time","geo","metric"]; s<3; s++){
							var rr=otr[roles[s]];
							if(rr!==null){
								gmt=gmt.concat(rr);
							}
						}

						otr.classification=[];

						//not inverse looping to preserve dim order
						for(var s=0; s<otdl; s++){
							if(!inArray(otdi[s], gmt)){
								otr.classification.push(otdi[s]);
							}
						}

						if(otr.classification.length===0){
							otr.classification=null;
						}
					}

					this.role=otr;

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
							// assumed for all browsers and default is array instead of object-)
							if(isArray(otd[otd.id[d]].category.index)){
								var oindex={}, index=otd[otd.id[d]].category.index;
								for (var i=0, ilen=index.length; i<ilen; i++){
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
			case "dimension" :
				var cats=[], ot=o.__tree__, otc=ot.category;
				if(
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
					cats[otc.index[prop]]=prop; //0.4.3 cats.push(prop) won't do because order not in control when index was originally an array and was converted to object by the Toolkit.
				}

				this.__tree__=ot;
				//When no dimension label, undefined is returned.
				//Discarded options: null / dim
				this.label=ot.label || null;
				this.note=ot.note || null; //v.0.7.0
				this.link=ot.link || null; //v.0.7.0
				this.href=ot.href || null; //v.0.7.0
				this.id=cats;
				this.length=cats.length;
				this.role=o.role;
				this.hierarchy=otc.hasOwnProperty("child"); //0.6.0
				this.extension=ot.extension || null; //v.0.7.0
			break;
			case "category" :
				var par=o.child;

				//0.5.0 changed. It was autoreference: id. And length was 0 always
				this.id=par;
				this.length=(par===null) ? 0 : par.length;

				this.index=o.index;
				this.label=o.label;
				this.note=o.note || null; //v.0.7.0

				this.unit=o.unit; //v.0.5.0
				this.coordinates=o.coord; //v.0.5.0
			break;
		}
	}

	jsonstat.prototype.Dataset=function(ds){
		if (this===null || this.class!=="bundle"){
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
			var num=this.id[ds];
			return (typeof num!=="undefined") ? this.Dataset(num) : null;
		}

		var tds=this.__tree__[ds];
		if(typeof tds==="undefined"){
			return null;
		}

		return new jsonstat({"class" : "dataset", "__tree__": tds});
	}

	jsonstat.prototype.Dimension=function(dim){
		function role(otd,dim){
			var otdr=otd.role;
			if(otdr!==null){
				for(var prop in otdr){
					for(var p=(otdr[prop]!==null ? otdr[prop].length : 0); p--;){
						if(otdr[prop][p]===dim){
							return prop;
						}
					}
				}
			}
			return null;
		}

		if (this===null || this.class!=="dataset"){
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
			var num=this.id[dim];
			return (typeof num!=="undefined") ? this.Dimension(num) : null;
		}

		var otd=this.__tree__.dimension;
		if(typeof otd==="undefined"){
			return null;
		}

		//currently only "role" is supported as filter criterion
		if(typeof dim==="object"){
			if(dim.hasOwnProperty("role")){
				var ar=[];
				for(var c=0, len=this.id.length; c<len; c++){
					var oid=this.id[c];
					if(role(otd,oid)===dim.role){
						ar.push(this.Dimension(oid));
					}
				}
				return (typeof ar[0]==="undefined") ? null : ar;
			}else{
				return null;
			}
		}

		var otdd=otd[dim];
		if(typeof otdd==="undefined"){
			return null;
		}

		return new jsonstat({"class" : "dimension", "__tree__": otdd, "role": role(otd,dim)});
	}

	jsonstat.prototype.Category=function(cat){
		if (this===null || this.class!=="dimension"){
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
			var num=this.id[cat];
			return (typeof num!=="undefined") ? this.Category(num) : null;
		}

		var oc=this.__tree__.category;
		if(typeof oc==="undefined"){
			return null;
		}
		var index=oc.index[cat];
		if(typeof index==="undefined"){
			return null;
		}

		var
			unit=(oc["unit"] && oc["unit"][cat]) || null,
			coord=(oc["coordinates"] && oc["coordinates"][cat]) || null,
			child=(oc["child"] && oc["child"][cat]) || null,
			note=(oc["note"] && oc["note"][cat]) || null
		;
		return new jsonstat({"class" : "category", "index": index, "label": oc.label[cat], "note": note, "child" : child, "unit" : unit, "coord" : coord});
	}

	jsonstat.prototype.Data=function(e){
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

		if(this===null || this.class!=="dataset"){
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
			var num=this.value[e];
			return (typeof num!=="undefined") ?
				{"value" : num, "status":
					(this.status) ?
					this.status[e]
					:
					null
				}
				:
				null
			; /* removed in 0.5.2.2 length: 1 {"value" : undefined, "status": undefined, "length" : 0};*/
		}

		var tree=this.__tree__, n=tree.dimension.size, dims=n.length //same as this.length;

		//DataByPosition in every dim
		//If more positions than needed are provided, they will be ignored.
		//Less positions than needed will return undefined
		if(isArray(e)){
			if(this.length!==e.length){ //0.5.2.2
				return null;
			}
			var mult=1,
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
						return null; /* removed in 0.5.2.2 {"value" : undefined, "status": undefined, "length" : 0};*/
					}
					//Used if normal case (miss.length===0)
					mult*=(i>0) ? n[(dims-i)] : 1;
					res+=mult*e[dims-i-1]; //simplified in 0.4.3
				}else{
					//Used if missing dimensions miss.length>0
					miss.push(i); //missing dims
					nmiss.push(n[i]); //missing dims size
				}
			}

			//If all dims are specified, go ahead as usual.
			//If one non-single dimension is missing create array of results
			//If more than one non-single dimension is missing, WARNING
			if(miss.length>1){
				return null; /* removed in 0.5.2.2 {"value" : undefined, "status": undefined, "length" : 0};*/
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

			//miss.length===0 (use previously computed res) //simplified in 0.4.3
			return {"value" : this.value[res], "status": (this.status) ? this.status[res] : null/*, "length" : 1*/};
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
		if(this===null || this.class!=="dataset"){
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
					this, //0.5.3
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
				valuetype=(typeof this.value[0]==="number" || this.value[0]===null) ? "number" : "string", //cell type inferred from first cell. If null, number is assumed (naif)
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
					cols.push({id: "value", label: vlabel, type: valuetype});
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
						var rowid=(opts.content!=="id" && dd[ddi[i]].category.label) ? dd[ddi[i]].category.label[catid] : catid; //id if not label (Maybe move label normalization from "dimension" to "dataset"?)
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
				addRow(
					(this.status) ? this.status[x] : null
				);
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
		return this.class; //improve?
	}
	jsonstat.prototype.toValue=function(){
		return this.length;
	}

	JSONstat.jsonstat=jsonstat;
})();

//nodejs
module.exports=JSONstat;
