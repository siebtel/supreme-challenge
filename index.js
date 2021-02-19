//imports
const Papa = require('papaparse');
const fs = require('fs');

//variables
var list_of_users = []
let list_of_input = [];

class User {
	constructor(fullname, eid, groups, addresses, visible, access_level){
		this.fullname = fullname;
		this.eid = eid;
		this.groups = groups;
		this.addresses = addresses;
		this.invisible = visible;
		this.see_all = access_level;
	}
}

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


function get_addresses(list_of_input){
	for (const property in list_of_input){
		var address = property.split(' ');
		if ( address.length > 1 && (address[0] == 'email' || address[0] == 'phone')){
			
		}
	}
	return 0;
}

function get_groups() {
	return 0;
}

for (let i = 0; i < list_of_input.length; i++) {
	var fullname = list_of_input[i]['fullname'];
	var eid = list_of_input[i]['eid'];
	var addresses = get_addresses(list_of_input[i]);
	var groups = get_groups();
	var visibility = list_of_input[i]['visibility'];
	var access_level = list_of_input[i]['access_level'];
	var user = new User(fullname,
		eid,
		addresses,
		groups,
		visibility,
		access_level);
	list_of_users.push(user);
}