//Polyfills forEach, querySelector, querySelectorAll, toLocaleString (fallback: toFixed, locale ignored)

/* global JSONstat */
/* jshint newcap:false */
var JSONstatUtils=function(){
	"use strict";

	//////////////////////////////////////////////////////
	//{i18n: {msgs: {}, locale: ""}, dsid: 0, status: false, selector: , jsonstat: , preset: ""}
	function tbrowser(obj){
		var
			msgs=(typeof obj.i18n==="undefined" || typeof obj.i18n.msgs==="undefined") ?
				{
					"selerror": 'tbrowser: "selector" property is required!',
					"urierror": 'tbrowser: "jsonstat" property is required!',
					"jsonerror": "Document is not valid JSON-stat.",
					"dserror": "Dataset ID is not correct.",
					"dimerror": "Only one dimension was found in the dataset. At least two are required.",
					"dataerror": "Selection returned no data!",
					"source": "Source",
					"filters": "Filters",
					"constants": "Constants",
					"rc": "Rows &amp; Columns",
					"na": "n/a"
				}
				:
				obj.i18n.msgs,
			locale=(typeof obj.i18n==="undefined" || typeof obj.i18n.locale==="undefined") ? "en-US" : obj.i18n.locale,
			dsid=obj.dsid || 0,
			shstatus=obj.status || false, //added in 1.2.1
			jsonstat
		;

		if(typeof obj.selector==="undefined"){
			msg("selerror");
			return;
		}

		if(typeof obj.jsonstat==="undefined"){
			msg("urierror");
			return;
		}

		if(typeof obj.jsonstat==="string"){
			//uri
			jsonstat=JSONstat(obj.jsonstat);
		}else{
			if(typeof obj.jsonstat.length==="undefined"){
				//JSON-stat response
				jsonstat=JSONstat(obj.jsonstat);
			}else{
				//JSON-stat response already processed by JSONstat()
				jsonstat=obj.jsonstat;
			}
		}

		if( jsonstat.length===0 ){
			msg("jsonerror");
			return;
		}

		var ds=(jsonstat.class==="dataset") ? jsonstat : jsonstat.Dataset(dsid);

		if( !checksize(ds) ){
			msg("jsonerror");
			return;
		}

		if( ds===null ){
			msg("dserror");
			return;
		}

		if( ds.length===1 ){
			msg("dimerror");
			return;
		}

		function msg(s){
			if(typeof obj.selector!=="undefined"){
				obj.selector.innerHTML=msgs[s];
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

			// Initialize filters
			if(id==="rowscols"){
				o.filter={};
				ds.id.forEach(function(e,i){
					if(e!==o.rows && e!==o.cols){
						o.filter[ e ]=ds.Dimension(i).id[0];
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

		function pairs(e){
			var
				arr=[],
				selects=[].slice.call(e.querySelectorAll("select, input"))
			;
			selects.forEach(function(e){
				arr.push( {name: e.name, value: e.value} );
			});
			return arr;
		}

		function labelize(dim, cat){
			var ulabel=function(d, c){
				if(d && d.role==="metric"){
					return (c.unit && c.unit.hasOwnProperty("label")) ? " ("+c.unit.label+")" : "";
				}
				return "";
			};
			return cat.label.capitalize()+ulabel(dim, cat);
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
					html+='<option '+selected+'value="'+e+'">'+labelize(dim, arr[i])+'</option>';
				}
			});

			html+="</select>";

			return html;
		}

		function HTMLtable(element, ds, o){
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
				source=(ds.source) ? msgs.source+": "+ds.source+"." : "",
				title=(ds.label!==null) ? '<span class="label">'+ds.label.capitalize()+'</span>' : ''
			;

			//Caption
			caption+="<caption>"+title;
			caption+=' <form><fieldset id="rowscols"><legend>'+msgs.rc+'</legend>'+select(ds, "rows", [r, c])+' <a>&#x2194;</a> '+select(ds, "cols", [c, r])+'</fieldset>';

			for(var name in filter){
				var
					dim=ds.Dimension(name),
					label=dim.label.capitalize()
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

			caption+=filtfield+constfield+"</form></caption>";

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

			element.innerHTML="<table>"+caption+head+foot+body+"</table>";

			[].slice.call(element.querySelectorAll("select")).forEach(function(e){
				e.addEventListener("change", function(event) {

					HTMLtable(
						element,
						ds,
						objectify(
							ds,
							event.target.parentElement.getAttribute("id"),
							pairs(element)
						)
					);
				}, false);

			});

			element.querySelector("a").addEventListener("click", function() {
				o.cols=r;
				o.rows=c;
				HTMLtable( element, ds, o );
			}, false);
		}

		//Create table with default setup
		HTMLtable( obj.selector, ds, setup(ds, obj.preset) );
	}

	//on error returns null; on success, html table string
	//{jsonstat: , dsid: , na:, caption:}
	function datalist(obj){
		var 
			na=obj.na || "n/a",
			dsid=obj.dsid || 0,

			trs="",
			colvalue=0,
			table,
			ds,
			jsonstat
		;

		if(typeof obj.jsonstat==="undefined"){
			return null;
		}

		if(typeof obj.jsonstat==="string"){
			//uri
			jsonstat=JSONstat(obj.jsonstat);
		}else{
			if(typeof obj.jsonstat.length==="undefined"){
				//JSON-stat response
				jsonstat=JSONstat(obj.jsonstat);
			}else{
				//JSON-stat response already processed by JSONstat()
				jsonstat=obj.jsonstat;
			}
		}

		if( jsonstat.length===0 ){
			return null;
		}

		ds=(jsonstat.class==="dataset") ? jsonstat : jsonstat.Dataset(dsid);
		if( ds===null || !checksize(ds) ){
			return null;
		}

		table=ds.toTable();
		colvalue=table[0].length-1;

		table.forEach(function(r,i){
			trs+=(i) ? '<tr><td class="value">'+i+'</td>' : '<tr><th class="value">#</th>';
 			r.forEach(function(e,c){
				var 
					cls=(colvalue===c) ? ' class="value"' : '',
					val=(e===null) ? na : e
				;
				
				trs+=(i) ? '<td'+cls+'>'+val+'</td>' : '<th'+cls+'>'+val+'</th>';
 			});
			trs+="</tr>";
		});

		return '<table><caption>'+(obj.caption || ds.label)+'</caption><tbody>'+trs+"</tbody></table>";
	}

	function fromTable(o){
		var
			vfield=o.vfield || "Value",
			sfield=o.sfield || "Status",
			type=o.type || "array", //obj.type default is array as in .toTable()
			tbl=o.table,
			label=o.label || "",

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
				var v=tbl[dd][vfield];
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
			if(field!==vfield){
				if(field!==sfield){
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
						var v=tbl[dd][vfield];
						value[getPos(pos, size)]=( isNaN(v) ) ? null : v;
						status[getPos(pos, size)]=tbl[dd][sfield];
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

		dimension.id=id;
		dimension.size=size;

		return {
			"class": "dataset",
			"label": label, //added in 1.2.2
			"value": value,
			"status": status,
			"dimension": dimension
		};
	}

	//{csv/table, (delimiter, decimal) if csv, vfield, sfield, type, vlast}
	//Accepts a CSV (string) or a table array
	//Returns JSONstat or table array
	function fromCSV(o){
		var 
			vfield=o.vfield || "Value", //Same default as .toTable()
			type=o.type || "jsonstat" //vs "table" (array)
		;

		if(o.table){
			table=o.table;
		}else{ //o.csv (file) used as input instead of o.table
			var 
				i,
				vcol=null,
				delimiter=o.delimiter || ",",
				decimal=(delimiter===";") 
					? 
					","
					:
					(delimiter==="\t" ? (o.decimal || ".") : ".") 
				,
				table=CSVToArray(o.csv, delimiter),
				nrows=table.length,
				i=table[0].length
			;

			if(o.vlast){ //simple standard CSV without status: value is last column
				vcol=i-1;
				vfield=table[0][vcol];
			}else{ //if no vlast, vfield is required
				for(;i--;){
					if(table[0][i]===vfield){
						vcol=i;
						break;
					}
				}				
				if(vcol===null){
					return null; //vfield not found in the CSV
				}
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
		}

		if(type==="table"){
			return table;
		}else{
			return fromTable({
				table: table,
				vfield: vfield,
				sfield: o.sfield || "Status", //Same default as .toTable()
				type: "array",
				label: o.label //added in 1.2.2
			});
		}
	}


	//Private

	function checksize(ds){
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

	return {
		tbrowser: tbrowser,
		datalist: datalist,
		fromTable: fromTable,
		fromCSV: fromCSV,
		version: "1.3.0"
	};
}();
