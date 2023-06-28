// JS code to handle button click event

var button = document.getElementById("myButton");
button.addEventListener("click", function () {
  var username = document.getElementById("username").value;
  alert("hello" + username + "!");
});
