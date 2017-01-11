$(document).ready(function(){
    var printAnalytics = function (data) {
        $("#todos").text("The number of todo's: " + data.numberOfTodos);
        $("#clearedTodos").text("The number of cleared todos's: " + data.numberOfFinishedTodos);
        $("#lists").text("The number of lists's: " + data.numberOfLists);
    };

    setInterval(function () {
        //  note: to use setInterval() you have to implement a mechanisms
        //  that checks which todos are already shown to the client

        $.getJSON("/analytics", printAnalytics)
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                console.log("incoming Text " + jqXHR.responseText);
            });
    }, 2000);

    //update
    $.getJSON("/analytics", printAnalytics)
        .error(function (jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        });
});
