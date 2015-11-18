//Polyfills forEach, querySelector, querySelectorAll, toLocaleString (fallback: toFixed, locale ignored)

/* jshint newcap:false */
var JSONstatUtils=function(){
	"use strict";

	//////////////////////////////////////////////////////
	function tbrowser(obj){
		var
			checksize=function(ds){
				for(var i=ds.length, len=1; i--;){
					len*=ds.Dimension(i).length;
				}
				if(len!==ds.n){
					return false;
				}
				return true;
			},
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
					"rc": "Rows &amp; Columns"
				}
				:
				obj.i18n.msgs,
			locale=(typeof obj.i18n==="undefined" || typeof obj.i18n.locale==="undefined") ? "en-US" : obj.i18n.locale,
			dsid=obj.dsid || 0,
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
		function setup(ds){
			var
				ids=ds.id,
				rows=ids[0],
				cols=ids[1],
				filter={}
			;

			//"Smart" selection of rows/cols (smarter: avoid constant dimensions)
			if( ds.Dimension(0).length<ds.Dimension(1).length ){
				rows=ids[1];
				cols=ids[0];
			}

			for(var i=2, len=ids.length; i<len; i++){
				filter[ ids[i] ]=ds.Dimension(i).id[0];
			}

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

			//if val is array, then it's a row/col select; otherwise, it's a filter select
			if( v[1]!==null ){
				id=ds.id;
				arr=ds.Dimension();
				//More than two dims are needed to display row/col select
				if(id.length===2){
					return arr[0].label;
				}
			}else{
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
							decimals=(c!==metricname) ?
								//Metric is not in cols or no metric at all
								( (metric===null) ? null : dec( metric.Category( cell[metricname] ) ) )
								:
								//Metric dimension in columns
								dec( cols.Category(i) ),
							val=(col.value!==null) ? format(col.value, decimals) : col.status
						;
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
		HTMLtable( obj.selector, ds, setup(ds) );
	}

	String.prototype.capitalize=function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	return {
		tbrowser: tbrowser
	};
}();
