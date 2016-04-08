"use strict";
var fs = require("fs");

var events = [];
class EventMan {

	constructor() {
		try {
			var jsonEvents = fs.readFileSync("events.json", "utf8");//read from file (string)
			events = JSON.parse(jsonEvents);	
		} catch (e) {
			console.log(e.code);
		}
	}
	
	addEvent(id, name, date) {
		events.push({"id":id, "title":name, "start":date});
	}
	
	deleteEvent(id){
		let i = events.findIndex(e => e.id==id);
		if(i>-1) {
			events.splice(i,1);
		}
	}
	
	editEvent(id, name, date){
		let i = events.findIndex(e => e.id==id);
		if(i>-1) {
			events[i].title = name;
			events[i].start = date;
		}
	}
	
	editEventDate(id, date){
		let i = events.findIndex(e => e.id==id);
		if(i>-1) {
			events[i].start = date;
		}
	}
	
	getEvent(id){
		return events[events.findIndex(e => e.id==id)];
	}
	
	getAllEvents(){
		return events;
	}
	
	writeToFile(){
		fs.writeFileSync("events.json", JSON.stringify(events), "utf8");//write to file
	}
};

module.exports = EventMan;