import {TweetDiv} from "./components.js";

export const formatDate = (input) => {
  const date = new Date(input);
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

export const getTwitterLink = (tweet) => {
  const urlPrefix = "https://twitter.com/TwitterAPI/status/";
  return urlPrefix + tweet.id;
}

export const getHomeTimeline = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    const divTimeline = document.getElementById("divTimeline");
    divTimeline.innerHTML = ""; // Clearing previous text
    if (this.readyState == XMLHttpRequest.DONE)  {
      if (this.status == 200) {
        divTimeline.classList.add("divTimelineWithContent");
        let tweets = [];
        const obj = JSON.parse(this.responseText);
        obj.forEach((tweet) => tweets.push(TweetDiv(tweet)));
        ReactDOM.render(tweets,
          document.getElementById("divTimeline"));
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
