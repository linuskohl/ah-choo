/**
 * Copyright (c) 2018
 *
 * JavaScript code ah-choo
 *
 * @author Linus Kohl <linus@munichresearch.com>
 *
 * Created at     : 2018-10-10
 * Last modified  : 2018-10-10
 */

var timer;
var indicator;
var graphic;
var position;
var date;

window.onload = function () {
  graphic_element = document.getElementById("graphic");
  graphic_object = graphic_element.contentDocument;

  indicator = graphic_object.getElementById("indicator");
  graphic = graphic_object.getElementById("svg");

  graphic.onclick = function (e) {
    clearInterval(timer);
    pt = graphic.createSVGPoint();
    pt.x = e.clientX;
    loc = pt.matrixTransform(graphic.getScreenCTM().inverse());
    position = (loc.x <= 10) ? 0 : loc.x - 10;
    date = new Date();
    setCookie('date', date, 20);
    setCookie('position', position, 20);
    updateIndicator();
    timer = setInterval(updateIndicator, 10000);
  }

  position = getCookie('position');
  date = new Date(getCookie('date'));
  if (position && date) {
    updateIndicator();
    timer = setInterval(updateIndicator, 10000);
  }
}

var updateIndicator = function () {
  var currentDate = new Date();
  var daysPassed = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  var progress = 16.8 * daysPassed;
  current_position = +progress + +position;
  if (current_position > 182) {
    indicator.style.display = "none";
    clearInterval(timer);
    deleteCookie('date');
    deleteCookie('position');
  } else {
    indicator.style.display = "inline";
  }
  translate = "translate(" + current_position + ")";
  indicator.setAttribute('transform', translate);
}


var setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  console.log(cvalue);
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var getCookie = function (cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var deleteCookie = function (cname) {
  document.cookie = cname + '=; Max-Age=-99999999;';
}
