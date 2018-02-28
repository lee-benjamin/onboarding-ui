import {formatDate} from "./twitter.js";
import {getTwitterLink} from "./twitter.js";
import {getHomeTimeline} from "./twitter.js";

const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () => {
    getHomeTimeline( (tweets) => {
    console.log(tweets);
    ReactDOM.render(e(TimelineContainer, {tweets: tweets}),
      document.getElementById("root"));
  });
});

class TimelineContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets: props.tweets};
  }

  render() {
    return e(
      "div",
      {className: "TimelineContainer"},
      e(HomeTimelineButton, {}),
      e(Timeline, {tweets: this.state.tweets})
    );
  }
}

class HomeTimelineButton extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    //this.state = {tweets: props.tweets}
    this.state = {};
  }

  handleClick() {
    console.log("clicked");
    //ReactDOM.unmountComonentAtNode(document.getElementById("root"));
    //this.setState(prevState => getHomeTimeline());
    //getHomeTimeline();
  };

  render() {
    return e(
      "button",
      {onClick: this.handleClick},
      "Get Home Timeline"
    );
  }
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

export function Timeline(props) {
  let tweets = [];
  props.tweets.forEach((tweet) => tweets.push(Tweet(tweet)));
  return e(
    "div",
    {className: "divTimeline"},
    tweets
  );
}

export function Tweet(props) {
  return e (
    "div",
    {
      className: "Tweet",
      key: props.id
    },
    e(Avatar, {user: props.user}),
    e(TweetContent, {tweet: props}),
  );
}
