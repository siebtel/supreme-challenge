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

//merge_eid
function customizer(objValue, srcValue) {
	let list = [];
	if (ld.isArray(objValue)){
		objValue.push(srcValue);
		return [...new Set(objValue)];
	}else if (ld.isArray(srcValue)){
		srcValue.push(objValue);
		return [...new Set(srcValue)];
	}else if(objValue !== srcValue){
		list.push(objValue, srcValue);
		return [...new Set(list)];
	}
}

for (let i = 0; i < list_of_input.length - 1; i++) {
	let j = i+1;
	while (j < list_of_input.length) {
		if (list_of_input[i]['eid'] == list_of_input[j]['eid']){
			ld.mergeWith(list_of_input[i], list_of_input[j], customizer);
			list_of_input.splice(j,1);
		}else{
			j++;
		}
	}
}