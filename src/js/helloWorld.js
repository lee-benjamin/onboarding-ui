var domready = require("domready");

domready(function () {
     ReactDOM.render(
      React.createElement("div", null, "hello, react!"),
      document.getElementById("reactComponent"));
});

//document.addEventListener("DOMContentLoaded", function(event) {
//  ReactDOM.render(
//    React.createElement("div", null, "hello, react!"),
//    document.getElementById("reactComponent")
//  );
//});
