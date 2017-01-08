$(document).ready(function(){
    load();
});

function load(){
    //load todo's
    var addTodosToList = function (todos) {
        console.log("Loading todos from server");
        var todolist = document.getElementById("todo");
        for (var key in todos) {//add all todosLists
            var group = document.createElement("section");
            group.className = "todoList";
            group.innerHTML +=  "<header><p>" + todos[key].name + "</p><nav><a href=''>&#xf067;</a><a href=''>&#xf0c9;</a></nav></header><ul><li>hello</li></ul>";
            var list = group.getElementsByTagName("ul")[0];
            for (var key2 in todos[key].todos) {
                var todoItem = todos[key].todos[key2];
                list.innerHTML += "<li>" + todoItem.message + "</li>";
                list.innerHTML += "<div class='itemInfo'><p>overdue: " + todoItem.deadline + "</p><p>importance 5</p></div>";
            }
            todolist.appendChild(group);
        }
    };

    //animate todo Items drop down
    $(".todoList > ul > li").click(function(){
        var infoHeight = 50;
        //check if the info bar is already open
        if ($(this).next().height()>10) {
            $(this).next().children().css("visibility", "hidden");
            if ($(this).next().is(":last-child")) {
                $(this).next().animate({height: "0px"}, {duration: 500, queue: false, complete: function() {
                    $(this).css({"background-color": "#BEC3C7","border-bottom": "none","height":"0px"});
                }});
            } else {
                $(this).next().animate({height: "1px"}, {duration: 500, queue: false, complete: function() {
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
            $(this).next().css({"background-color": "#FFF", "border-bottom": "solid 1px #BEC3C7"});
            $(this).next().animate({height: infoHeight,}, {duration: 500, queue: false});
            $(this).next().children().css("visibility", "visible");
        }
    })

    setInterval(function () {
        //  note: to use setInterval() you have to implement a mechanisms
        //  that checks which todos are already shown to the client

        $.getJSON("/todos", addTodosToList)
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    }, 2000);
}