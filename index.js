//imports
const Papa = require('papaparse');
const fs = require('fs');
const ld = require('lodash');
const { result } = require('lodash');

//variables
var list_of_users = []
let list_of_input = [];

class User {
	constructor(fullname, eid, groups, addresses, visibility, access_level){
		this.fullname = fullname;
		this.eid = eid;
		this.groups = groups;
		this.addresses = addresses;
		this.invisible = visibility;
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

//write in 
function write_to_json(){
	fs.writeFile('output.json', JSON.stringify(list_of_users, null, ' '), 'utf8', function(err){
		if(err) throw err;
	});
}
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


function get_addresses(input){
	var addresses = [];
	for (const property in input){
		var possible_address = property.split(' ');
		if ( possible_address.length > 1 && (possible_address[0] == 'email' || possible_address[0] == 'phone')){
			var address = { "type" : possible_address[0],
							"tags" : possible_address.slice(1),
							"address" : input[property]};
							addresses.push(address);
		}
	}
	return addresses;
}

function get_groups(input) {
	var groups = [];
	const re = /[/\|?:;_\-,\$] ?/
	for (const property in input){
		var possible_group = property.split(' ');
		if ( possible_group[0] == "group"){
			var temp_groups = input[property] + '';
			temp_groups = temp_groups.split(re);
			groups.push(temp_groups);
		}
	}
	return [...new Set(groups.flat())];
}

function get_boolean(visibility){
	var result;
	if (visibility == true || visibility == 'yes' || visibility == '1' || visibility == 1){
		result = true;
	}else{
		result = false;
	}
	return result;
}


for (let i = 0; i < list_of_input.length; i++) {
	var fullname = list_of_input[i]['fullname'];
	var eid = list_of_input[i]['eid'];
	var addresses = get_addresses(list_of_input[i]);
	var groups = get_groups(list_of_input[i]);
	var visibility = get_boolean(list_of_input[i]['invisible']);
	var access_level = get_boolean(list_of_input[i]['see_all']);
	var user = new User(fullname,
		eid,
		groups,
		addresses,
		visibility,
		access_level);
	list_of_users.push(user);
}

write_to_json();