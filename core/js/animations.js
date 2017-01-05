$(document).ready(function(){
  //animate todo Items drop down
  $(".todoList").on('click', 'li', function(){
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

  });

  $(".todoList").on('click', '.addTodo', function() {
    var parent = $(this).parent().parent().parent().find("ul");
    $(parent).append('<li class="newTodo">new todo</li>');
    $(parent).append('<div class="itemInfo"></div>');
    var child = $(parent).children('li').last();
    $(child).animate({height: '24px', 'padding': '8px 16px'}, {duration:500, queue: true});
  });

});
