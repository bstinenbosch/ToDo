$(document).ready(function(){
    var printAnalytics = function (data) {
        console.log(data);
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
