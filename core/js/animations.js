$(document).ready(function(){
    animateCats();
    //$( ".catAdd" ).click(function() {$( this ).slideUp();});
    load();
});

var clientTodos = [];

function load(){
    setInterval(function () {
        //  note: to use setInterval() you have to implement a mechanisms
        //  that checks which todos are already shown to the client

        $.getJSON("/todos", addTodosToList)
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    }, 2000);

    //update
    $.getJSON("/todos", addTodosToList)
        .error(function (jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        });
}

/**
 * loading todo's from server and adding them to the screen
 * @param todos
 */
var addTodosToList = function (todos) {
    if (!sameTodos(todos)) {
        clientTodos = todos;
        updateTodos(todos);
        animateItems();
        animateLists();
    }
};

/**
 * Check if the todo items are different
 * @param todos
 * @returns {boolean}
 */
function sameTodos(todos) {
    if (JSON.stringify(todos) == JSON.stringify(clientTodos)) {
        return true;
    }
    return false;
}

/**
 * Replace all todo's with new todo's
 * @param todos
 */
function updateTodos(todos) {
    $("#todo").empty();
    console.log("Loading todos from server");
    var todolist = document.getElementById("todo");
    for (var key in todos) {//add all todosLists
        var group = document.createElement("section");
        group.id = todos[key].Id;
        group.className = "todoList";
        group.innerHTML +=  "<header><p>" + todos[key].Name + "</p><nav><a class='addItem'>&#xf067;</a><a>&#xf0c9;</a></nav></header><ul></ul>";
        var list = group.getElementsByTagName("ul")[0];
        for (var key2 in todos[key].todos) {
            var todoItem = todos[key].todos[key2];
            //add todo to screen
            list.innerHTML += "<li id='" + todoItem.Id + "'>" + todoItem.Title + "</li><span class='checkTodo' style='display: none;'>&#xf00c;</span>";
            list.innerHTML += "<div class='itemInfo'><p>overdue: " + todoItem.DueDate + "</p><p>priority: " + todoItem.Priority + "</p></div>";
        }
        todolist.appendChild(group);
    }
}

function animateItems() {
    //animate todo Items drop down
    $(".todoList > ul > li").click(function(){
        var infoHeight = 50;
        console.log($(this).next().next().height());
        //check if the info bar is already open
        if ($(this).next().next().height()>10) {
            $(this).next().next().children().css("visibility", "hidden");
            if ($(this).next().next().is(":last-child")) {
                $(this).next().next().animate({height: "0px"}, {duration: 500, queue: false, complete: function() {
                    $(this).css({"background-color": "#BEC3C7","border-bottom": "none","height":"0px"});
                }});
            } else {
                $(this).next().next().animate({height: "1px"}, {duration: 500, queue: false, complete: function() {
                    $(this).css({"background-color": "#BEC3C7","border-bottom": "none","height":"1px"});
                }});
            }
        } else {
            //First hide all Items
            $(".itemInfo").each(function( index ) {
                if ($(this).height()>10) {//if open --> close
                    $(this).children().css("visibility", "hidden");
                    if ($(this).is(":last-child")) {//Last item in list
                        $(this).animate({height: "0px"}, {duration: 500, queue: false, complete: function() {
                            $(this).css({"background-color": "#BEC3C7","border-bottom": "none","height":"0px"});
                        }});
                    } else {
                        $(this).animate({height: "1px"}, {duration: 500, queue: false, complete: function() {
                            $(this).css({"background-color": "#BEC3C7","border-bottom": "none","height":"1px"});
                        }});
                    }
                }
            });
            //show this info
            $(this).next().next().css({"background-color": "#FFF", "border-bottom": "solid 1px #BEC3C7"});
            $(this).next().next().animate({height: infoHeight,}, {duration: 500, queue: false});
            $(this).next().next().children().css("visibility", "visible");
        }
    })
    //animate checkbox
    $(".todoList li").hover(function(){
        $(this).next().show();
    });
    $(".todoList li").mouseleave(function(){
        $(this).next().hide();
    });
    //

}

function animateLists() {
    //animate todo Items drop down
    $(".addItem").click(function(){
        var listID = $(this).parent().parent().parent().attr('id');
        $.ajax({
            dataType: "json",
            url: "./addtodo",
            data: { listID: listID }
        });

        //update todo's
        $.getJSON("/todos", addTodosToList)
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    })
}

function animateCats() {
    //make it possible to add a catagory
    $( ".catAdd" ).click(function(){
        $.ajax({
            dataType: "json",
            url: "./addtodolist"
        });
        console.log("Testing i am here!!!!");

        //update todo's
        $.getJSON("/todos", addTodosToList)
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    })
}