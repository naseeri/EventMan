"use strict";
var open = require("open");

var mainApp = require('./eventman');
var eMan = new mainApp();

const express = require("express");
let app = express();

app.use(express.static('public'));

app.post("/events/:id", (req,res) => {
	console.log("Delete Service Called. Url: "+req.originalUrl);
	eMan.deleteEvent(req.params.id);
	res.json("success");
});

app.post("/events/:name/:date", (req,res) => {
	console.log("Add Service Called. Url: "+req.originalUrl);
	var rand = Math.floor(Math.random()*10000);
	eMan.addEvent(rand, req.params.name, req.params.date);
	res.json(rand);
});

app.post("/events/:id/:date/:type", (req,res) => {
	console.log("Edit Service Called. Url: "+req.originalUrl);
	eMan.editEventDate(req.params.id, req.params.date);
	res.json("success");
});

app.get("/events", (req,res) => {
	console.log("Sending All "+eMan.getAllEvents().length+" Events.");
	res.json(eMan.getAllEvents());
});

app.get("/events/:id", (req,res) => {
	res.json(eMan.getEvent(req.params.id));
});

process.on('SIGINT', function(){
	console.log("Exiting...");
	eMan.writeToFile();
	process.exit(2);
});

app.listen(7870, function(){
	console.log("Server Started...")
	open("http://localhost:7870");
});