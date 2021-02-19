//imports
const Papa = require('papaparse');
const fs = require('fs');

//variables
var list_of_users = []
let list_of_input = [];

//open csv and load
const config = {
	delimiter: ",",
	header: true,
	transformHeader:function(h, i) {
		if (h == "group"){
			return String(h + " " + i);
		}else{
			return h;
		}
	}
};
var csv = fs.readFileSync('input.csv', 'utf8');
var json = Papa.parse(csv, config);
list_of_input = json['data'];