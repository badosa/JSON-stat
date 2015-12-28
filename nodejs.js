// jsonstat module for Node.js tests

var
	http=require('http'),
	JSONstat=require('jsonstat'),
	uri="http://json-stat.org/samples/oecd-canada-col.json"
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
				oecd=J.Dataset(0),
				canada=J.Dataset(1),
				ok=true,
				test=[
					{
						text: "First item ID",
						real: J.id[0],
						exp: "http://json-stat.org/samples/oecd.json"
					},
					{
						text: "Second dimension ID",
						real: J.Dataset(0).id[1],
						exp: "area"
					},
					{
						text: "First dimension with role 'time'",
						real: J.Dataset(0).role.time[0],
						exp: "year"
					},
					{
						text: "Number of categories in dimension 'area'",
						real: J.Dataset(0).Dimension("area").length,
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
						text: "First value",
						real: J.Dataset(0).Data([0,0,0]).value,
						exp: 5.943826289
					},
					{
						text: "Unemployment rate in Spain in 2012 (via Data)",
						real: J.Dataset(0).Data({"concept":"UNR","area":"ES","year":"2012"}).value,
						exp: 25.04773498
					},
					{
						text: "Unemployment rate in Norway in 2012 (via toTable)",
						real: J.Dataset(0).toTable({type: "arrobj", content: "id"},function(d){if(d.area==="NO" && d.year==="2012"){return d.value;}})[0],
						exp: 3.098584692
					},

					//From the JJT Test Suite (http://json-stat.com/test/)
					{
						text: 'Number of items in a JSON-stat collection response',
						exp: 2,
						real: J.length
					},

					{
						text: 'Number of datasets in a JSON-stat collection response',
						exp: 2,
						real: J.Item({class: "dataset"}).length
					},

					{
						text: 'Number of embedded datasets in a JSON-stat collection response',
						exp: 2,
						real: J.Item({class: "dataset", embedded: true}).length
					},

					{
						text: 'Label of the first embedded dataset',
						exp: 'Unemployment rate in the OECD countries 2003-2014',
						real: J.Dataset(0).label
					},

					{
						text: 'Label of the second embedded dataset',
						exp: 'Population by sex and age group. Canada. 2012',
						real: J.Dataset(1).label
					},

					{
						text: 'Number of observations in OECD',
						exp: 432,
						real: oecd.n
					},

					{
						text: 'Date of OECD',
						exp: '2012-11-27',
						real: oecd.updated
					},

					{
						text: 'Source of OECD',
						exp: 'Economic Outlook No 92 - December 2012 - OECD Annual Projections',
						real: oecd.source
					},

					{
						text: 'First note assigned to OECD',
						exp: 'Most of the data in this dataset are taken from the individual contributions of national correspondents appointed by the OECD Secretariat with the approval of the authorities of Member countries. Consequently, these data have not necessarily been harmonised at international level.',
						real: oecd.note[0]
					},

					{
						text: 'Contact information of OECD',
						exp: 'EcoOutlook@oecd.org',
						real: oecd.extension.contact
					},

					{
						text: 'Address of the first metadata file in OECD',
						exp: 'http://www.oecd.org/eco/economicoutlookanalysisandforecasts/EO92macroeconomicsituation.pdf',
						real: oecd.extension.metadata[0].href
					},

					{
						text: 'Number of dimensions of OECD',
						exp: 3,
						real: oecd.length
					},

					{
						text: 'Number of dimensions of OECD using the Dimension() method',
						exp: 3,
						real: oecd.Dimension().length
					},

					{
						text: 'Number of dimensions of the second dataset',
						exp: 5,
						real: J.Dataset(1).length
					},

					{
						text: 'Number of embedded datasets',
						exp: 2,
						real: J.Dataset().length
					},

					{
						text: 'Id of the second dimension in OECD',
						exp: 'area',
						real: oecd.id[1]
					},

					{
						text: 'Id of the first dimension with role "time" in OECD',
						exp: 'year',
						real: oecd.role.time[0]
					},

					{
						text: 'Number of dimensions with role "time"  in OECD',
						exp: 1,
						real: oecd.role.time.length
					},

					{
						text: 'Id of the first dimension with role "geo" in OECD',
						exp: 'area',
						real: oecd.role.geo[0]
					},

					{
						text: 'Label of the second dimension in OECD',
						exp: 'OECD countries, EU15 and total',
						real: oecd.Dimension(1).label
					},

					{
						text: 'Label of dimension "area" in OECD',
						exp: 'OECD countries, EU15 and total',
						real: oecd.Dimension("area").label
					},

					{
						text: 'Label of the second dimension in OECD',
						exp: 'OECD countries, EU15 and total',
						real: oecd.Dimension()[1].label
					},

					{
						text: 'Role of the second dimension in OECD',
						exp: 'geo',
						real: oecd.Dimension(1).role
					},

					{
						text: 'Role of the second dimension in CANADA using the Dimension() method without arguments',
						exp: 'time',
						real: canada.Dimension()[1].role
					},

					{
						text: 'Role of dimension "year" in CANADA',
						exp: 'time',
						real: canada.Dimension("year").role
					},

					{
						text: 'First note assigned to dimension "area" in OECD',
						exp: 'Except where otherwise indicated, data refer to the actual territory of the country considered.',
						real: oecd.Dimension("area").note[0]
					},

					{
						text: 'Type of the first link with an "alternate" relation of dimension "sex" in CANADA',
						exp: 'text/html',
						real: canada.Dimension("sex").link.alternate[0].type
					},

					{
						text: 'Address of the first link with an "alternate" relation of dimension "sex" in CANADA',
						exp: 'http://www.statcan.gc.ca/concepts/definitions/class-sex-eng.htm',
						real: canada.Dimension("sex").link.alternate[0].href
					},

					{
						text: 'Definition of the unemployment rate (UNR concept) in OECD',
						exp: 'The OECD harmonised unemployment rate gives the number of unemployed persons as a percentage of the labour force (the total number of people employed plus unemployed).',
						real: oecd.Dimension("concept").extension.definition.UNR
					},

					{
						text: 'Number of categories in dimension "area" in OECD',
						exp: 36,
						real: oecd.Dimension("area").length
					},

					{
						text: 'Id of the first category in dimension "area" in OECD',
						exp: 'AU',
						real: oecd.Dimension("area").id[0]
					},

					{
						text: 'Label of category "AU" in dimension "area" in OECD',
						exp: 'Australia',
						real: oecd.Dimension("area").Category("AU").label
					},

					{
						text: 'Label of the first category in the second dimension of OECD',
						exp: 'Australia',
						real: oecd.Dimension(1).Category(0).label
					},

					{
						text: 'Label of the first category as before using the Category() method without arguments',
						exp: 'Australia',
						real: oecd.Dimension(1).Category()[0].label
					},

					{
						text: 'Number of children of category "EU15" in dimension "area"',
						exp: 15,
						real: oecd.Dimension("area").Category("EU15").length
					},

					{
						text: 'Coordinates of category "AU" in dimension "area", if available',
						exp: null,
						real: oecd.Dimension("area").Category("AU").coordinates
					},

					{
						text: 'First note assigned to category "DE" of dimension "area" in OECD',
						exp: 'Germany (code DE) was created 3 October 1990 by the accession of the Democratic Republic of Germany (code DDR) to the then Federal Republic of Germany (code DEW).',
						real: oecd.Dimension("area").Category("DE").note[0]
					},

					{
						text: 'First value in OECD',
						exp: 5.943826289,
						real: oecd.Data(0).value
					},

					{
						text: 'Value of the cell where the three dimensions are in their first category',
						exp: 5.943826289,
						real: oecd.Data([0,0,0]).value
					},

					{
						text: 'Unemployment rate in Greece in 2014 according to the OECD',
						exp: 27.2364419,
						real: oecd.Data({"concept":"UNR","area":"GR","year":"2014"}).value
					},

					{
						text: 'Female population in Canada in 2012 according to StatCan',
						exp: 17571.3,
						real: canada.Data({"concept":"POP","country":"CA","year":"2012","age":"T","sex":"F"}).value
					},

					{
						text: 'Male population in Canada in 2012 according to StatCan',
						exp: 17309.1,
						real: canada.Data({"concept":"POP","age":"T","sex":"M"}).value
					},

					{
						text: 'Observation status of unemployment rate in Greece in 2014 according to the OECD',
						exp: 'e',
						real: oecd.Data({"area":"GR","year":"2014"}).status
					},

					{
						text: 'Number of cells in OECD',
						exp: 432,
						real: oecd.Data().length
					}
				]
			;

			test.forEach(function(d){
				var t=d.real===d.exp?"Passed":"Not passed!";
				console.log(d.text+": "+d.real+" ("+t+")\n");
				if(t!=="Passed"){
					ok=false;
				}
			});
			console.log(ok?"\nALL TESTS WERE SUCCESSFULLY PASSED.\n":"\nWARNING: SOME TEST FAILED!\n");
			return ok;
		});
	}else{
		console.log("Can't retrieve document (error "+s+")");
	}
}).on("error", function(e) {
	console.log("Connection error: " + e.message);
});