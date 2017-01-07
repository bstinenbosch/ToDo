var main = function () {
	"use strict";

	var addTodosToList = function (todos) {

		console.log("Loading todos from server");
		var todolist = document.getElementById("todo-list");
		while (todolist.firstChild) {//remove all todos
    	todolist.removeChild(todolist.firstChild);
		}
		for (var key in todos) {//add all todos
			var li = document.createElement("li");
			li.innerHTML = "TODO: " + todos[key].message;
			todolist.appendChild(li);
		}
	};

	setInterval(function () {
//  note: to use setInterval() you have to implement a mechanisms
//  that checks which todos are already shown to the client

		$.getJSON("../todos", addTodosToList)
			.error(function (jqXHR, textStatus, errorThrown) {
				console.log("error " + textStatus);
				console.log("incoming Text " + jqXHR.responseText);
			});
	}, 2000);
};
$(document).ready(main);
