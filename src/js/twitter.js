const domready = require("domready");

domready(() => {
    const button = document.getElementById("getTimelineButton");
    button.addEventListener("click", getHomeTimeline);
    getHomeTimeline();
});

const addImage = (tweetDiv, tweet) => {
  // Append the image within a figure tag
  const figure = document.createElement("figure");
  figure.setAttribute("class", "userContent");
  const figCaption = document.createElement("figcaption");
  figCaption.innerHTML = "<div class='imageCaption'>" + tweet.user.screenName + "<div class='screenName'>" + tweet.user.name +"</div></div>";
  const tweetImg = document.createElement("img");
  tweetImg.setAttribute("class", "img-circle");
  tweetImg.src = tweet.user.profileImageURL;

  figure.appendChild(tweetImg);
  figure.appendChild(figCaption);
  tweetDiv.appendChild(figure);
}

const formatDate = (date) => {
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();

  return monthNames[monthIndex] + " " + day;
}

const addTime = (tweetDiv, tweet) => {
  // Append the timestamp
  const timeDiv = document.createElement("div");
  timeDiv.setAttribute("class", "timeDiv");
  const createdAt = document.createTextNode(formatDate(new Date(tweet.createdAt)));
  timeDiv.appendChild(createdAt);
  tweetDiv.appendChild(timeDiv);
}

const addText = (tweetDiv, tweet) => {
  // Link the div to Twitter
  const a  = document.createElement("a");
  const urlPrefix = "https://twitter.com/TwitterAPI/status/";
  a.setAttribute("href", urlPrefix + tweet.id);
  a.setAttribute("target", "_blank");

  // Append the body of the tweet
  const bodyDiv = document.createElement("div");
  bodyDiv.innerHTML = tweet.text;
  a.appendChild(bodyDiv);
  tweetDiv.appendChild(a);
}

const appendTweet = (tweet) => {
  // Each tweet will live in a <div>
  const tweetDiv = document.createElement("div"); // The root element of the tweet
  tweetDiv.classList.add("tweetDiv");

  addImage(tweetDiv, tweet);
  // create a div to hold the date and text
  const tweetContent = document.createElement("div");
  tweetContent.setAttribute("class", "tweetContent");
  addTime(tweetContent, tweet);
  addText(tweetContent, tweet);
  tweetDiv.appendChild(tweetContent);
  // Append the new tweet block to the DOM
  const element = document.getElementById("divTimeline");
  element.appendChild(tweetDiv);
}

const getHomeTimeline = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    const divTimeline = document.getElementById("divTimeline");
    divTimeline.innerHTML = ""; // Clearing previous text
    if (this.readyState == XMLHttpRequest.DONE)  {
      if (this.status == 200) {
        divTimeline.classList.add("divTimelineWithContent");
        const obj = JSON.parse(this.responseText);
        obj.forEach((tweet) => {appendTweet(tweet)});
      }
      else {
        divTimeline.classList.remove("divTimelineWithContent");
        divTimeline.innerHTML = "Unable to get home timeline, please try again later.";
      }
    }
  };
  xhttp.open("GET", "http://localhost:8080/api/1.0/twitter/timeline",true);
  xhttp.send();
}
