/*

JSON-stat Javascript Utilities Suite v. 2.2.7 (requires JJT 0.10+)
https://json-stat.com
https://github.com/badosa/JSON-stat/tree/master/utils

Copyright 2017 Xavier Badosa (https://xavierbadosa.com)

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

//Polyfills forEach, querySelector, querySelectorAll, toLocaleString (fallback: toFixed, locale ignored), trim, Array.indexOf
/* global JSONstat */
/* jshint newcap:false */
var JSONstatUtils=function(){
	"use strict";

	//////////////////////////////////////////////////////
	//jsonstat selector {i18n: {msgs: {}, locale: ""}, dsid: 0, status: false, preset: ""}
	function tbrowser(jsonstat, selector, options){
		if(typeof jsonstat==="undefined"){
			msg("urierror");
			return;
		}

		if(typeof selector==="undefined"){
			msg("selerror");
			return;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			msgs=(typeof options.i18n==="undefined" || typeof options.i18n.msgs==="undefined") ?
				{
					"urierror": 'tbrowser: A valid JSON-stat input must be specified.',
					"selerror": 'tbrowser: A valid selector must be specified.',
					"jsonerror": "The request did not return a valid JSON-stat dataset.",
					"dimerror": "Only one dimension was found in the dataset. At least two are required.",
					"dataerror": "Selection returned no data!",
					"source": "Source",
					"filters": "Filters",
					"constants": "Constants",
					"rc": "Rows &amp; Columns",
					"na": "n/a"
				}
				:
				options.i18n.msgs,
			locale=(typeof options.i18n==="undefined" || typeof options.i18n.locale==="undefined") ? "en-US" : options.i18n.locale,
			dsid=options.dsid || 0,
			shstatus=options.status || false, //added in 1.2.1
			tblclass=options.tblclass || "",
			nonconst=options.nonconst || false //2.10.0
		;

		var ds=dataset(jsonstat, dsid);
		if(!checkds(ds)){
			msg("jsonerror");
			return;
		}

		//Remove constant dimensions
		if(nonconst){
			var removed=killconst(ds);
		}

		if(ds.length===1){
			msg("dimerror");
			return;
		}

		function msg(s){
			if(typeof selector!=="undefined"){
				selector.innerHTML=msgs[s];
			}else{
				window.alert(msgs[s]);
			}
		}

		function objectify(ds, id, arr){
			var o={ filter: {} };

			arr.forEach(function(e){
				if("rows"===e.name || "cols"===e.name){
					o[e.name]=e.value;
				}else{
					o.filter[e.name]=e.value;
				}
			});

			//Rows or cols changes affect filters
			if(id==="rowscols"){
				ds.id.forEach(function(e,i){
					if(e!==o.rows && e!==o.cols){
						//Assign only new filters (keep selected values in existing filters)
						if(typeof o.filter[ e ]==="undefined"){
							o.filter[ e ]=ds.Dimension(i).id[0];
						}
					}else{
						delete o.filter[ e ];
					}
				});
			}

			return o;
		}

		// Build a default setup
		function setup(ds, preset){
			var
				filter={}, arr=[], rows, cols,
				ids=ds.id
			;

			if(preset){
				var order=(preset==="bigger") ?
					function(a,b){
						if(a.len < b.len){
							return 1;
						}
						return -1;
					}
					: //smaller
					function(a,b){
						if(a.len > b.len){
							return 1;
						}
						return -1;
					}
				;

				ds.Dimension().forEach(function(e,i){
					arr.push({ id: ids[i], len : e.length });
				});

				arr.sort(order);
				rows=arr[0].id;
				cols=arr[1].id;
			}else{ //Default: simpler
				rows=ids[0];
				cols=ids[1];
			}

			//Swap rows<->cols if needed
			if( ds.Dimension(rows).length<ds.Dimension(cols).length ){
				rows=cols+(cols=rows, ""); //http://jsperf.com/swap-array-vs-variable/33
			}

			ids.forEach(function(e){
				if(e!==rows && e!==cols){
					filter[e]=ds.Dimension(e).id[0];
				}
			});

			return { rows: rows, cols: cols, filter: filter };
		}

		function pairs(el){
			var
				arr=[],
				selects=[].slice.call(el.querySelectorAll("select, input"))
			;
			selects.forEach(function(e){
				arr.push( {name: e.name, value: e.value} );
			});

			return arr;
		}

		function labelize(dim, cat, name){
			var
				ulabel=function(d, c){
					if(d && d.role==="metric"){
						return (c.unit && c.unit.hasOwnProperty("label")) ? " ("+c.unit.label+")" : "";
					}
					return "";
				},
				label=cat.label || name
			;
			return label.capitalize()+ulabel(dim, cat);
		}

		function select(ds, name, v){
			var
				html='<select name="'+name+'">',
				arr=[],
				id
			;

			if( v[1]!==null ){ //row/col select
				id=ds.id;
				arr=ds.Dimension();

				//More than two dims are needed to display row/col select
				if(id.length===2){
					return (ds.Dimension(v[0]).label || v[0]).capitalize();
				}
			}else{ //Filter select
				var dim=ds.Dimension(name);
				id=dim.id;
				arr=dim.Category();
				//More than one dim is needed to display a category select (filter)
				if(id.length===1){
					return; //Constant dimensions have their own fieldset
				}
			}

			id.forEach(function(e, i){
				var selected=(e!==v[0]) ? '' : 'selected="selected" ';

				//If null is a filter select: all options must be included
				if(v[1]===null || e!==v[1]) {
					html+='<option '+selected+'value="'+e+'">'+labelize(dim, arr[i], e)+'</option>';
				}
			});

			html+="</select>";

			return html;
		}

		function HTMLtable(element, ds, o, tblclass){
			var
				head="",
				foot="",
				caption="",
				body="",
				r=o.rows,
				rows=ds.Dimension(r),
				rid=rows.id,
				c=o.cols,
				cols=ds.Dimension(c),
				cid=cols.id,
				metricname=(ds.role && ds.role.metric) ? ds.role.metric[0] : null,
				metric=(metricname!==null) ? ds.Dimension(metricname) : null, /* only one dim can have metric role */
				dec=function(cat){
					return (cat.hasOwnProperty("unit") && cat.unit && cat.unit.hasOwnProperty("decimals")) ? cat.unit.decimals : null;
				},
				filter=o.filter,
				cell=JSON.parse(JSON.stringify(filter)), //clone filter
				constants=[],
				filtfield="",
				constfield="",
				source=(ds.source) ? msgs.source+": "+ds.source : "",
				title=(ds.label!==null) ? '<span class="label">'+ds.label.capitalize()+'</span>' : ''
			;

			if(nonconst && removed.length){
				title='<span class="label">'+removed.join(". ")+'</span>';
			}

			if(source!=="" && source.slice(-1)!==".") source+=".";

			//Caption
			caption+="<caption>"+title+'<form>';

			for(var name in filter){
				var
					dim=ds.Dimension(name),
					label=(dim.label) ? dim.label.capitalize() : name.capitalize()
				;

				if(dim.length>1){
					filtfield+="<p>"+select(ds, name, [filter[name], null])+" <strong>"+label+"</strong>"+"</p>";
				}else{
					constants.push({label: label, value: labelize(dim, dim.Category(0)), name: name, id: dim.id[0]});
				}
			}

			if(filtfield!==""){
				filtfield='<fieldset id="filters"><legend>'+msgs.filters+'</legend>'+filtfield+'</fieldset>';
			}

			constants.forEach(function(e){
				constfield+='<p>'+e.value+' <strong>'+e.label+'</strong></p><input type="hidden" name="'+e.name+'" value="'+e.id+'" />';
			});

			if(constfield!==""){
				constfield='<fieldset id="constants"><legend>'+msgs.constants+'</legend>'+constfield+'</fieldset>';
			}

			caption+=constfield+filtfield+'<fieldset id="rowscols"><legend>'+msgs.rc+'</legend>'+select(ds, "rows", [r, c])+' <a>&#x2194;</a> '+select(ds, "cols", [c, r])+"</fieldset></form></caption>";

			//Body
			body+="<tbody>";

			//If no decimal information, analyzed all data for every metric and infer decimals? Not for the moment.
			var format=(Number.toLocaleString) ?
				function(v, d){
					//toLocaleString because has better support than new Intl.NumberFormat(locale, { minimumFractionDigits: d }).format(v)
					return (d===null) ?
						v.toLocaleString(locale)
						:
						v.toLocaleString(locale, {minimumFractionDigits: d, maximumFractionDigits: d})
					;
				}
				:
				//If browser does not support toLocaleString, locale is ignored, sorry.
				function(v, d){
					//If no decimal information, analyzed all data for every metric and infer decimals? Not for the moment.
					return (d===null) ? v : v.toFixed(d);
				}
			;

			rid.forEach(function(e){
				cell[r]=e;
				var
					data=ds.Data(cell),
					td=function(col, i){
						var
							val,
							decimals=(c!==metricname) ?
								//Metric is not in cols or no metric at all
								( (metric===null) ? null : dec( metric.Category( cell[metricname] ) ) )
								:
								//Metric dimension in columns
								dec( cols.Category(i) )
						;

						if(col.value!==null){
							val=format(col.value, decimals);

							if(shstatus && col.status!==null){
								val+=" ("+col.status+")";
							}
						}else{
							val=col.status || msgs.na;
						}

						body+="<td>"+val+"</td>";
					}
				;

				if(data===null){
					body="ERROR";
					return;
				}

				body+='<tr><th scope="row">'+labelize(rows, rows.Category(e))+'</th>';

				//isArray
				if(Object.prototype.toString.call(data) === "[object Array]"){
					data.forEach(function(e, i){ td(e, i); });
				}else{
					td(data, 0);
				}

				body+="</tr>";
			});

			if(body==="ERROR"){
				return msgs.dataerror;
			}

			body+="</tbody>";

			//Head
			head+="<thead><tr><th></th>";
			cid.forEach(function(e){
				head+='<th scope="col">'+labelize(cols, cols.Category(e))+'</th>';
			});
			head+="</tr></thead>";

			//Foot
			if(source!==""){
				foot='<tfoot><tr><td colspan="'+(cid.length+1)+'">'+source+"</td></tr></tfoot>";
			}

			element.innerHTML='<table class="'+tblclass+'">'+caption+head+foot+body+"</table>";

			[].slice.call(element.querySelectorAll("select")).forEach(function(e){
				e.addEventListener("change", function(event) {

					HTMLtable(
						element,
						ds,
						objectify(
							ds,
							event.target.parentElement.getAttribute("id"),
							pairs(element)
						),
						tblclass
					);
				}, false);

			});

			element.querySelector("a").addEventListener("click", function() {
				o.cols=r;
				o.rows=c;
				HTMLtable( element, ds, o, tblclass );
			}, false);
		}

		//Create table with default setup
		HTMLtable( selector, ds, setup(ds, options.preset), tblclass );
	}

	//on error returns null; on success, html table string
	//jsonstat {dsid: , na:, caption:, vlabel:, slabel:, status:, }
	function datalist(jsonstat, options){
		if(typeof jsonstat==="undefined"){
			return null;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			trs="",
			tfoot="",
			ncols=0,
			na=options.na || "n/a", //for empty cells in the resulting datalist table
			dsid=options.dsid || 0,
			vlabel=options.vlabel || null, //take default value from toTable
			slabel=options.slabel || null, //take default value from toTable
			counter=options.counter || false,
			tblclass=options.tblclass || "",
			numclass=options.numclass || "",
			valclass=options.valclass || "",
			shstatus=options.status || false,
			locale=options.locale || "en-US",
			source=options.source || "Source",
			ds=dataset(jsonstat, dsid),

			format=(Number.toLocaleString) ?
				function(n){
					return n.toLocaleString(locale);
				}
				:
				function(n){
					return n;
				},

			trows=(counter) ?
				function(r,i){
					trs+=(i) ? '<tr><td class="'+numclass+'">'+i+'</td>' : '<tr><th class="'+numclass+'">#</th>';
					r.forEach(function(e,c){
						var
							cls=(colvalue===c) ? ' class="'+numclass+" "+valclass+'"' : '',
							val=(e===null) ? na : format(e)
						;

						trs+=(i) ? '<td'+cls+'>'+val+'</td>' : '<th'+cls+'>'+val+'</th>';
					});
					trs+="</tr>";
				}
				:
				function(r,i){
					trs+='<tr>';
					r.forEach(function(e,c){
						var
							cls=(colvalue===c) ? ' class="'+numclass+" "+valclass+'"' : '',
							val=(e===null) ? na : format(e)
						;

						trs+=(i) ? '<td'+cls+'>'+val+'</td>' : '<th'+cls+'>'+val+'</th>';
					});
					trs+="</tr>";
				}
		;

		if(!checkds(ds)){
			return null;
		}

		var
			table=ds.toTable({
				status: shstatus,
				vlabel: vlabel,
				slabel: slabel
			}),
			colvalue=table[0].length-1
		;

		table.forEach( function(r,i){ trows(r,i); } );

		if(ds.source){
			ncols=ds.length+1;
			if(counter) ncols++;
			if(shstatus) ncols++;

			source+=": "+ds.source;
			if(source.slice(-1)!==".") source+=".";

			tfoot='<tfoot><td colspan="'+ncols+'">'+source+'</td></tfoot>';
		}

		return '<table class="'+tblclass+'"><caption>'+(options.caption || ds.label || "")+'</caption>'+tfoot+'<tbody>'+trs+"</tbody></table>";
	}

	function fromTable(tbl, options){
		if(typeof tbl==="undefined"){
			return null;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			vlabel=options.vlabel || "Value",
			slabel=options.slabel || "Status",
			type=options.type || "array", //default is array as in .toTable()
			label=options.label || "",

			id=[],
			size=[],
			value=[],
			status=[],
			odims={},
			dimension={},
			getPos=function(e,size){
				var
					mult=1,
					res=0
				;
				for(var i=0; i<dims; i++){
					mult*=(i>0) ? size[(dims-i)] : 1;
					res+=mult*e[dims-i-1];
				}
				return res;
			},
			valuestatus=function(){
				var v=tbl[dd][vlabel];
				value[getPos(pos, size)]=( isNaN(v) ) ? null : v;
			}
		;

		//Convert to "arrobj". Not efficient but simple.
		switch(type){
			case "array":
				//From array to arrobj
				tbl=(function(tbl){
					var
						head=tbl[0],
						arr=tbl.slice(1)
					;

					var arrobj=[];
					for(var d=0, dlen=arr.length; d<dlen; d++){
						for(var f=0, flen=head.length, o={}; f<flen; f++){
							o[head[f]]=arr[d][f];
						}
						arrobj.push(o);
					}
					return arrobj;
				})(tbl);
			break;

			case "object":
				//From object to arrobj
				tbl=(function(tbl){
					var
						head=tbl.cols.map(function(e) {return e.id;}),
						//Pending: retrieve labels
						arr=tbl.rows
					;

					var arrobj=[];
					for(var d=0, dlen=arr.length; d<dlen; d++){
						for(var f=0, flen=head.length, o={}; f<flen; f++){
							o[head[f]]=arr[d].c[f].v;
						}
						arrobj.push(o);
					}
					return arrobj;
				})(tbl);
			break;
		}

		var obs=tbl.length;

		//Dimensions are taken from first observation
		for(var field in tbl[0]){
			if(field!==vlabel){
				if(field!==slabel){
					id.push(field);

					odims[field]=[];
					for(var j=0; j<obs; j++){
						var e=tbl[j][field];

						if(odims[field].indexOf(e)===-1){
							odims[field].push(e);
						}
					}

					size.push(odims[field].length);

					dimension[field]={
						"label": field,
						"category": {
							"index": odims[field]
						}
					};
				}else{ //status field is present
					valuestatus=function(){
						var v=tbl[dd][vlabel];
						value[getPos(pos, size)]=( isNaN(v) ) ? null : v;
						status[getPos(pos, size)]=tbl[dd][slabel];
					};
				}
			}
		}

		var dims=id.length;

		for(var dd=0; dd<obs; dd++){
			var pos=[];
			for(var i=0; i<dims; i++){
				var d=id[i];
				pos.push( odims[d].indexOf(tbl[dd][d]) );
			}
			valuestatus();
		}

		/* For JSON-stat<2.00
		dimension.id=id;
		dimension.size=size;
		*/

		return {
			"version": "2.0",
			"class": "dataset",
			"label": label, //added in 1.2.2
			"value": value,
			"status": status,
			"dimension": dimension,

			//JSON-stat 2.00+
			"id": id,
			"size": size
		};
	}

	function toCSV(jsonstat, options){
		if(typeof jsonstat==="undefined"){
			return null;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			csv=[],
			vlabel=options.vlabel || "Value", //Same default as .toTable()
			slabel=options.slabel || "Status", //Same default as .toTable()
			status=(options.status===true), //Same default as .toTable()
			na=options.na || "n/a",
			delimiter=options.delimiter || ",",
			decimal=(delimiter===";") ?
				(options.decimal || ",")
				:
				(options.decimal || "."),
			dsid=options.dsid || 0,
			ds=dataset(jsonstat, dsid)
		;

		if(!checkds(ds)){
			return null;
		}

		var
			table=ds.toTable({vlabel: vlabel, slabel: slabel, status: status, type: "array"}),
			vcol=table[0].indexOf(vlabel),
			scol=status ? table[0].indexOf(slabel) : -1
		;

		table.forEach(function(r, j){
			r.forEach(function(c, i){
				if(j && i===vcol){
					if(c===null){
						r[i]='"' + na + '"';
					}else{
						if(decimal!=="."){
							r[i]=String(r[i]).replace(".", decimal);
						}
					}
				}else{
					if(j && i===scol && c===null){
						r[i]=""; //Status does not use n/a because usually laking of status means "normal".
					}else{
						r[i]='"' + r[i] + '"';
					}
				}
			});

			csv+=r.join(delimiter)+"\n";
		});

		return csv;
	}

	//csv, {vlabel, slabel, delimiter, decimal, label}
	//Returns JSONstat
	function fromCSV(csv, options){
		if(typeof csv==="undefined"){
			return null;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			vcol=null,
			delimiter=options.delimiter || ",",
			vlabel=options.vlabel,
			decimal=(delimiter===";") ?
				(options.decimal || ",")
				:
				(options.decimal || "."),
			table=CSVToArray(csv.trim(), delimiter),
			nrows=table.length,
			i=table[0].length
		;

		//2.1.3: If no vlabel, last column used
		if(typeof vlabel!=="undefined"){
			for(;i--;){
				if(table[0][i]===vlabel){
					vcol=i;
					break;
				}
			}
			if(vcol===null){
				return null; //vlabel not found in the CSV
			}
		}else{//simple standard CSV without status: value is last column
			vcol=i-1;
			vlabel=table[0][vcol];
		}

		if(decimal===","){
			for(i=1; i<nrows; i++){
				table[i][vcol]=Number(table[i][vcol].replace(",", "."));
			}
		}else{
			for(i=1; i<nrows; i++){
				table[i][vcol]=Number(table[i][vcol]);
			}
		}


		return fromTable(
			table, {
				vlabel: vlabel,
				slabel: options.slabel || "Status", //Same default as .toTable()
				type: "array",
				label: options.label || ""
			})
		;
	}

	//Private

	function checkds(ds){
		if(ds===null || ds.length===0 || ds.class!=="dataset"){
			return false;
		}

		for(var i=ds.length, len=1; i--;){
			len*=ds.Dimension(i).length;
		}
		if(len!==ds.n){
			return false;
		}
		return true;
	}

	String.prototype.capitalize=function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	//CSVToArray by Ben Nadel: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
	function CSVToArray( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		var
			objPattern = new RegExp(
				(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
			),
			// Create an array to hold our data. Give the array
			// a default empty first row.
			arrData = [[]],
			// Create an array to hold our individual pattern
			// matching groups.
			arrMatches = null,
			strMatchedValue,
			strMatchedDelimiter
		;

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){
			// Get the delimiter that was found.
			strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );
			}

			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
				);
			}else{
				// We found a non-quoted value.
				strMatchedValue = arrMatches[ 3 ];
			}

			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}

		// Return the parsed data.
		return( arrData );
	}

	function dataset(j, dsid){
		if(typeof j==="undefined"){
			return null;
		}
		if(
			typeof j==="string" || //uri (synchronous!)
			typeof j.length==="undefined" //JSON-stat response
			){
			j=JSONstat(j);
		}

		if(j.length===0 ||
			(
				j.class!=="dataset" &&
				j.class!=="collection" &&
				j.class!=="bundle"
			)
		){
			return null;
		}

		return (j.class==="dataset") ? j : j.Dataset(dsid);
	}

	function killconst(ds){
		var
			del=0,
			size=ds.size.slice(0),
			killed=[]
		;

		size.forEach(function(e,i){
			var
				pos=i-del,
				dim=ds.Dimension(pos)
			;
			if(e===1){ //Won't work with providers specifying sizes as strings (CSO)
				delete ds.__tree__.dimension[ds.id[pos]];
				ds.size.splice(pos,1);
				ds.id.splice(pos,1);
				ds.length--;
				del++;
				killed.push( dim.label.capitalize()+": "+dim.Category(0).label.capitalize() );
			}
		});

		return killed;
	}

	//Takes an array of JSON-stat 2.0 Dataset responses
	function join(arrobj, options){
		if(typeof arrobj==="undefined" ||
			Object.prototype.toString.call(arrobj) !== "[object Array]"
		){
			return null;
		}

		var
			arr=JSON.parse( JSON.stringify(arrobj) ), //clone
			output=arr[0]
		;

		if(!output.hasOwnProperty("version") || //Not JSON-stat v.2.0
			!output.hasOwnProperty("class") ||
			output.class!=="dataset"
		){
			return null;
		}

		if(typeof options==="undefined"){
			options={};
		}

		var
			dslabel=(typeof options.label==="undefined") ? null : options.label,
			dimid=(typeof options.by==="undefined") ? null : options.by,
			input=[]
		;

		//Join metadata+data1+data2+...
		if(dimid===null){
			for(var i=1, len=arr.length; i<len; i++){
				input=input.concat( arr[i].value ); //or .push.apply
			}

			output.value=input;

			if(dslabel!==null){
				output.label=dslabel;
			}

			return output;
		}

		//Join by dimension
		var
			index, label, unit,
			oAdd=function(o, e, i){
				if(Object.prototype.toString.call(o) === "[object Array]"){
					o=o.concat(e);
				}else{
					for(var p in e){
						o[p]=(e[p]===0) ? i : e[p];
					}
				}
				return o;
			}
		;

		arr.forEach(function(e, i){
			var
				tbl=JSONstat(e).toTable({ status: true }),
				cat=e.dimension[dimid].category
			;

			//header
			if(i===0){
				input=[tbl[0]];
				index=cat.index;
				label=cat.label;
				unit=cat.unit;
			}else{
				index=oAdd(index, cat.index, i);
				label=oAdd(label, cat.label, i);
				unit=oAdd(unit, cat.unit, i);
			}
			input=input.concat( tbl.slice(1) ); //or .push.apply
		});

		var ds=JSONstatUtils.fromTable(input);

		output.value=ds.value;
		output.size=ds.size;
		output.status=ds.status || null;
		output.label=dslabel || "";
		output.href=null;

		output.dimension[dimid].category.index=index || null;
		output.dimension[dimid].category.label=label || null;
		output.dimension[dimid].category.unit=unit || null;

		return output;
	}

	return {
		tbrowser: tbrowser,
		datalist: datalist,
		fromTable: fromTable,
		fromCSV: fromCSV,
		toCSV: toCSV,
		join: join,
		version: "2.2.7"
	};
}();
