//Tonic Example File. For https://tonicdev.com
const
	JSONstat = require('jsonstat'),
	got = require("got"),
	unr = function(arr){
		got( "http://json-stat.org/samples/oecd.json" )
			.then(response => {
				var ds = JSONstat(JSON.parse(response.body));

				if(ds.length){
					arr.forEach(o => {
						var 
							value = ds.Data(o).value,
							label = (d => {
								return ds.Dimension(d).Category(o[d]).label;
							})
						;

						console.log( 
							"Unemployment rate in " + 
							label("area") + " in " + 
							label("year") + " was " +
							value + " %."
						);
					});
				}else{
					console.log("Response is not valid JSON-stat.");
				}
			})
			.catch(error => {
				console.log(error.response.body);
			})
		;
	}
;

//Time: 2003-2014 Geo: AU, AT, BE, CA...
unr([
	{year: "2003", area: "DE"},
	{year: "2003", area: "GR"}
]);