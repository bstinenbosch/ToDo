/* global Buffer */
/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");

var port = 3000;
var app = express();
app.use(express.static(__dirname + ""));
http.createServer(app).listen(port);

var todos = [];
var nextid = 3;
var list1 = {id : 1, name : "Personal", todos : []};
var list2 = {id : 2, name : "Working", todos : []};
var list3 = {id : 3, name : "Test", todos : []};
var t1 = { id : "1", message : "Maths homework due", deadline : "12/12/2015", priority : 1, text : ""};
var t2 = { id : "2", message : "English homework due", deadline : "20/12/2015", priority : 1, text : ""};
var t3 = { id : "3", message : "implement database", deadline : "12/12/2015", priority : 1, text : ""};
var t4 = { id : "4", message : "integrating adding todo's", deadline : "20/12/2015", priority : 1, text : ""};
list1.todos.push(t1);
list1.todos.push(t2);
list2.todos.push(t3);
list2.todos.push(t4);
todos.push(list1);
todos.push(list2);
todos.push(list3);

//clients requests todos
app.get("/todos", function (req, res) {
	console.log("todos requested!");
	res.json(todos);
});

//add todo to the server
app.get("/addtodo", function (req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["listID"]!==undefined) {
		var tx = {
			id: nextid,
			message : "New Item",
            deadline: "00/00/0000",
            priority: 5,
			text: "",
			listID: query["listID"]
		};
		nextid++;
        for (var key in todos) {
            if (todos[key].id == tx.listID) {
                todos[key].todos.push(tx);
			}
		}
		console.log("Added " + tx.id);
		res.end("Todo added successfully");
	}
	else {
		res.end("Error: missing message parameter");
	}
});

//remove todo from the server
app.get("/removetodo", function (req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["id"]!==undefined) {
		var id = query["id"];
		var length = todos.length;
		for (var i = 0; i<length; i++) {
			if (todos[i].id==id) {
				todos.splice(i,1);
				console.log("todo removed: " + id);
				break;
			}
		}
		res.end("Done");
	}
	else {
		res.end("Error: missing id parameter");
	}
});

//update todo
app.get("/updatetodo", function (req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["id"]!==undefined) {
		var id = query["id"];
		var result = "todo not found";
		var tx = {
			id: query["id"],
			message : query["message"],
			type: query["type"],
			deadline: query["deadline"]
		};
		for (var i = 0; i<todos.length; i++) {
			if (todos[i].id==id) {
				todos.splice(i,1,tx);
				console.log("todo updated: " + id);
				result = "updated!";
				break;
			}
		}
		res.end(result);
	}
	else {
		res.end("Error: missing id parameter");
	}
});
