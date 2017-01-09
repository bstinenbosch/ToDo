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
var t1 = { id : "1", message : "Maths homework due", type  : 1, deadline : "12/12/2015", timestamp : "1483944984258"};
var t2 = { id : "2", message : "English homework due", type : 3, deadline : "20/12/2015", timestamp : "1483944984258"};
list1.todos.push(t1);
list1.todos.push(t2);
todos.push(list1);

//clients requests todos
app.get("/todos", function (req, res) {
	console.log("todos requested!");
	res.json(todos);
});

//add todo to the server
app.get("/addtodo", function (req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["message"]!==undefined) {
		var tx = {
			id: nextid,
			message : query["message"],
			type: query["type"],
			deadline: query["deadline"]
		};
		nextid++;
		todos.push(tx);
		console.log("Added " + tx.id);
		res.end("Todo added successfully");
	}
	else {
		res.end("Error: missing message parameter");
	}
});

//add todo to the server
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

//add todo to the server
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
