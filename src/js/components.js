import {formatDate} from "./twitter.js";
import {getTwitterLink} from "./twitter.js";
import {getHomeTimeline} from "./twitter.js";

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
  };

  return e(
    "button",
    {onClick: handleClick},
    "Get Home Timeline"
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
    e(
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
    )
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

export function TweetDiv(props) {
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
