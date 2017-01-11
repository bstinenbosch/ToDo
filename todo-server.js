/* global Buffer */
/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");
var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo_copy"
});

con.connect(function(err){
    if(err){
        console.log(err);
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});
var connectionLive = false;

function closeConnection() {
    con.end(function (err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if (err) {
            console.log(err);
            return;
        }
        console.log('Connection closed');
    });
}

//setting up the server
var port = 3000;
var app = express();
app.use(express.static(__dirname + ""));
http.createServer(app).listen(port);

//clients requests todos
app.get("/todos", function (req, res) {
    console.log("todos requested!");
    loadTodosFromDB(res);
});

//add todo to the server
app.get("/a?d?d?t?o?d?o?", function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if(query["listID"]!==undefined) {
        var listID = query["listID"];
        con.query("INSERT INTO `todoitem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (NULL, 'new item', NULL, NULL, NULL, NULL, NULL, '1', '" + listID + "', NULL);",function(err,rows){
            if(err) throw err;
            console.log("Added todo to database");
            res.end("Todo added successfully");
        });
    }
    else {
        res.end("Error: missing message parameter");
    }
});

//add todoList to the server
app.get("/a?d?d?t?o?d?o?l?i?s?t?", function (req, res) {
    con.query("INSERT INTO `todolist` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (NULL, 'New List', NULL, NULL, NULL);",function(err,rows){
        if(err) throw err;
        console.log("Added todolist to database");
        res.end("Todo added successfully");
    });
});

//remove todo from the server
app.get("/r?e?m?o?v?e?t?o?d?o", function (req, res) {
    var url_parts = url.parse(req.url, true);
    var urlQuery = url_parts.query;

    if(urlQuery["itemID"]!==undefined) {
        var id = urlQuery["itemID"];
        var query = "UPDATE `todoitem` SET `Completed` = '1' WHERE `todoitem`.`Id` = " + id + ";";
        con.query(query, function(err,rows){
            if(err) throw err;
        });
        res.end("Done");
    }
    else {
        res.end("Error: missing id parameter");
    }
});

//update todo
app.get("/updatetodo", function (req, res) {
    console.log("try update");
    var url_parts = url.parse(req.url, true);
    var urlQuery = url_parts.query;

    if(urlQuery["id"]!==undefined) {
        var id = urlQuery["id"];
        var title = urlQuery["title"];
        var due = urlQuery["due"];
        var priority = urlQuery["priority"];
        var query = "UPDATE `todoitem` SET `Title` = '" + title + "', `DueDate` = '" + due + "', `Priority` = '" + priority + "' WHERE `todoitem`.`Id` = " + id + ";";
        con.query(query, function(err,rows){
            if(err) throw err;
        });
        res.end("todo updated");
    }
    else {
        res.end("Error: missing id parameter");
    }
});

//analytics
app.get("/analyt?ics", function (req, res) {
    console.log("request analytics");
    var result = {numberOfTodos:"",numberOfFinishedTodos:"",numberOfLists:""};

    con.query("SELECT COUNT(*) AS data FROM `todoitem`;", function(err,rows){
        if(err) throw err;
        var numberOfTodos = rows[0].data;
        con.query("SELECT COUNT(*) AS data FROM `todoitem` WHERE `Completed` = 1;", function(err,rows){
            if(err) throw err;
            var numberOfFinishedTodos = rows[0].data;
            con.query("SELECT COUNT(*) AS data FROM `todolist`;", function(err,rows){
                if(err) throw err;
                var numberOfLists = rows[0].data;
                result.numberOfTodos = numberOfTodos;
                result.numberOfFinishedTodos = numberOfFinishedTodos;
                result.numberOfLists = numberOfLists;
                res.json(result);
            });
        });
    });
});

//Functions
/**
 * Load todo's from database and send them back to the client
 * @param res
 */
function loadTodosFromDB(res) {
    var todos = []
    con.query("SELECT * FROM `todolist`;",function(err,rows){
        if(err) throw err;
        todos = rows;

        var key = 0;
        function loadTodoItems(){
            if (key<todos.length) {
                var query = "SELECT * FROM `todoitem` WHERE `ToDoListID` = " + todos[key].Id + " AND `Completed` IS NULL;";
                con.query(query, function(err,rows){
                    if(err) throw err;
                    todos[key].todos = rows;
                    ++key;
                    loadTodoItems();
                    //console.log(rows);
                });
            } else {
                //return todo's to client
                res.json(todos);
            }
        }
        loadTodoItems()
    });
}