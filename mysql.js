var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo_copy"
});

function openConnection() {
    con.connect(function(err){
        if(err){
            console.log(err);
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
    });
}

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

/*//create item
con.query("INSERT INTO `todoitem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (NULL, 'new item', NULL, NULL, NULL, NULL, NULL, '1', NULL, NULL);",function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
});

//create list
con.query("INSERT INTO `todolist` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (NULL, 'New List', NULL, NULL, NULL);",function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
});*/

//load all lists
openConnection();
var todos = []
con.query("SELECT * FROM `todolist`;",function(err,rows){
    if(err) throw err;
    todos = rows;

    var key = 0;
    function loadTodoItems(){
        if (key<todos.length) {
            var query = "SELECT * FROM `todoitem` WHERE `ToDoListID` = " + todos[key].Id + ";";
            con.query(query, function(err,rows){
                if(err) throw err;
                todos[key].todos = rows;
                ++key;
                loadTodoItems();
                //console.log(rows);
            });
        } else {
            closeConnection();
        }
    }
    loadTodoItems()
});