const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(GetHomeTimelineButton(),
    document.getElementById("getTimelineButton"));
  getHomeTimeline();
});

function GetHomeTimelineButton() {
  function handleClick() {
    ReactDOM.unmountComponentAtNode(document.getElementById("divTimeline"));
    getHomeTimeline();
  }

  return e(
    "button",
    {onClick: handleClick},
    "Get Home Timeline"
  );
}

function UserInfo(props) {
  return e(
    "figcaption",
    null,
    e(
      "div",
      { className: "imageCaption" },
      props.user.name,
      e(
        "div",
        { className: "screenName" },
        props.user.screenName
      )
    )
  );
}

function Avatar(props) {
  return e(
    "figure",
    { className: "Avatar" },
    e(
      "img",
      { className: "ProfilePic",
        src: props.user.profileImageURL
      }),
    e(UserInfo, {user: props.user}),
  );
}

function TweetContent(props) {
  return e(
    "div",
    {className: "TweetContent"},
    e("div", {className: "timeDiv"}, formatDate(props.tweet.createdAt)),
    e("a", {href: getTwitterLink(props.tweet), target: "_blank"},
      e("div", null, props.tweet.text)
    )
  );
}

function TweetDiv(props) {
  return e (
    "div",
    {
      className: "TweetDiv",
      key: props.id
    },
    e(Avatar, {user: props.user}),
    e(TweetContent, {tweet: props}),
  );
}

const formatDate = (input) => {
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
const getTwitterLink = (tweet) => {
  const urlPrefix = "https://twitter.com/TwitterAPI/status/";
  return urlPrefix + tweet.id;
}

const getHomeTimeline = () => {
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
