const twitter = require("./twitter.js");

const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(GetHomeTimelineButton(),
    document.getElementById("getTimelineButton"));
  twitter.getHomeTimeline();
});


function GetHomeTimelineButton() {
  function handleClick() {
    ReactDOM.unmountComponentAtNode(document.getElementById("divTimeline"));
    twitter.getHomeTimeline();
  };

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
    e("div", {className: "timeDiv"}, twitter.formatDate(props.tweet.createdAt)),
    e("a", {href: twitter.getTwitterLink(props.tweet), target: "_blank"},
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

exports.TweetDiv = TweetDiv;