// jsonstat module for Node.js tests

var 
	http=require('http'),
	JSONstat=require('jsonstat'),
	uri="http://json-stat.org/samples/oecd-canada.json"
;

console.log("\nRunning jsonstat v. "+JSONstat.version+" test...\n");

http.get(uri, function(res) {
	var 
		str="", 
		s=res.statusCode
	;
	if(s>=200 && s<300 || s===304){
		console.log("Connection to "+uri+" was successful.\n");

		res.on("data", function(chunk){
			str+=chunk;
		});
		res.on("end", function(){
			var 
				json=JSON.parse(str),
				J=JSONstat(json),
				ok=true,
				test=[
					{
						text: "First dataset ID",
						real: J.id[0],
						exp: "oecd"
					},
					{
						text: "Second dimension ID",
						real: J.Dataset(0).id[1],
						exp: "area"
					},
					{
						text: "First dimension with role 'time'",
						real: J.Dataset("oecd").role.time[0],
						exp: "year"
					},
					{
						text: "Number of categories in dimension 'area'",
						real: J.Dataset("oecd").Dimension("area").length,
						exp: 36
					},
					{
						text: "19th area ID",
						real: J.Dataset(0).Dimension(1).id[20],
						exp: "MX"
					},
					{
						text: "19th area label",
						real: J.Dataset(0).Dimension(1).Category(20).label,
						exp: "Mexico"
					},
					{
						text: "The first value",
						real: J.Dataset(0).Data([0,0,0]).value,
						exp: 5.943826289
					},
					{
						text: "The unemployment rate in Spain in 2012 (via Data)",
						real: J.Dataset(0).Data({"concept":"UNR","area":"ES","year":"2012"}).value,
						exp: 25.04773498
					},
					{
						text: "The unemployment rate in Norway in 2012 (via toTable)",
						real: J.Dataset(0).toTable({type: "arrobj", content: "id"},function(d){if(d.area==="NO" && d.year==="2012"){return d.value;}})[0],
						exp: 3.098584692
					}
				]
			;
			
			test.forEach(function(d){
				var t=d.real===d.exp?"Passed":"Not passed!";
				console.log(d.text+" is: "+d.real+" ("+t+")");
				if(t!=="Passed"){
					ok=false;
				}
			});
			console.log(ok?"\nAll tests were successfully passed.\n":"\nWarning: Some test failed!\n");
			return ok;
		});
	}else{
		console.log("Can't retrieve document (error "+s+")");
	}
}).on("error", function(e) {
	console.log("Connection error: " + e.message);
});