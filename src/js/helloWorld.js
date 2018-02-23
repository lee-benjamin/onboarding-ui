var domready = require("domready");

domready(() => {
     ReactDOM.render(
      React.createElement("div", null, "hello, react!"),
      document.getElementById("reactComponent"));
});
