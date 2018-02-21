function addImage(tweetDiv, tweet) {
  // Append the image within a figure tag
  var figure = document.createElement("figure");
  figure.setAttribute("class", "userContent");
  var figCaption = document.createElement("figcaption");
  figCaption.innerHTML = "<div class='imageCaption'>" + tweet.user.screenName + "<div id='screenName'>" + tweet.user.name +"</div></div>";
  var tweetImg = document.createElement("img");
  tweetImg.setAttribute("class", "img-circle");
  tweetImg.src = tweet.user.profileImageURL;

  figure.appendChild(tweetImg);
  figure.appendChild(figCaption);
  tweetDiv.appendChild(figure);
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();

  return monthNames[monthIndex] + " " + day;
}

function addTime(tweetDiv, tweet) {
  // Append the timestamp
  var timeDiv = document.createElement("div");
  timeDiv.setAttribute("id", "timeDiv");
  var createdAt = document.createTextNode(formatDate(new Date(tweet.createdAt)));
  timeDiv.appendChild(createdAt);
  tweetDiv.appendChild(timeDiv);
}

function addText(tweetDiv, tweet) {
  // Link the div to Twitter
  var a  = document.createElement("a");
  var urlPrefix = "https://twitter.com/TwitterAPI/status/";
  a.setAttribute("href", urlPrefix + tweet.id);
  a.setAttribute("target", "_blank");

  // Append the body of the tweet
  var bodyDiv = document.createElement("div");
  bodyDiv.innerHTML = tweet.text;
  a.appendChild(bodyDiv);
  tweetDiv.appendChild(a);
}


function appendTweet(tweet, color) {
  // Each tweet will live in a <div>
  var tweetDiv = document.createElement("div"); // The root element of the tweet
  tweetDiv.setAttribute("class", "tweetDiv");
  if (color) {
    tweetDiv.setAttribute("id", "lightTweet");
  }
  else {
    tweetDiv.setAttribute("id", "darkTweet");
  }

  addImage(tweetDiv, tweet);
  // create a div to hold the date and text
  var tweetContent = document.createElement("div");
  tweetContent.setAttribute("class", "tweetContent");
  addTime(tweetContent, tweet);
  addText(tweetContent, tweet);
  tweetDiv.appendChild(tweetContent);
  // clear block div for styling
  var clearfix = document.createElement("div");
  clearfix.setAttribute("class", "clearfix");
  tweetDiv.appendChild(clearfix);

  // Append the new tweet block to the DOM
  var element = document.getElementById("divTimeline");
  element.appendChild(tweetDiv);
}

function getHomeTimeline() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
   document.getElementById("divTimeline").innerHTML = "";
    var stylesheet = document.styleSheets[0];
    stylesheet.insertRule("#divTimeline {border-style: solid; border-width: 2px;}", 0);
    if (this.readyState == XMLHttpRequest.DONE)  {
      if (this.status == 200) {
        var obj = JSON.parse(this.responseText);
        for (var i=0;i<obj.length;i++) {
            appendTweet(obj[i], i % 2 == 0);
        }
      }
      else {
        document.getElementById("divTimeline").innerHTML = "Unable to get home timeline, please try again later.";
      }
    }
  };
  xhttp.open("GET", "http://localhost:8080/api/1.0/twitter/timeline",true);
  xhttp.send();
}
