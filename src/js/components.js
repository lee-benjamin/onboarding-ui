import {formatDate} from "./twitter.js";
import {getTwitterLink} from "./twitter.js";
import {getTimeline} from "./twitter.js";
import {getBothTimelines} from "./twitter.js";
import * as _ from "lodash/core";

const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () => {
  function successCallback(homeTweets, userTweets) {
    ReactDOM.render(e(ReactContainer, {userTweets: userTweets, homeTweets: homeTweets}),
      document.getElementById("root"));
  }

  function failureCallback() {
    ReactDOM.render(e(ReactContainer, {isServerError: true}),
      document.getElementById("root"));
  }

  getBothTimelines(successCallback, failureCallback);
});

class ReactContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeTweets: props.homeTweets,
      userTweets: props.userTweets,
      isServerError: props.isServerError
    };
  }

  render() {
    return e(
      "div",
      {className: "ReactContainer"},
      e(TimelineContainer, {className: "HomeTimeline", tweets: this.state.homeTweets}),
      e(TimelineContainer, {className: "UserTimeline", tweets: this.state.userTweets})
    );
  }
}

class TimelineContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets: props.tweets, isServerError: props.isServerError, className: props.className};
    this.handleClick = this.handleClick.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.failureCallback = this.failureCallback.bind(this);
  }

  successCallback(tweets) {
    this.setState({tweets: tweets, isServerError: false});
  }

  failureCallback() {
    this.setState({isServerError: true});
  }

  handleClick() {
    let endpoint = (this.state.className == "UserTimeline" ? "user" : "home");
    getTimeline(endpoint, this.successCallback, this.failureCallback);
  }

  render() {
    const userTimeline = (this.state.className == "UserTimeline" ? true : false);
    const isServerError = this.state.isServerError == true;
    let buttonName = (userTimeline ? "Get User Timeline" : "Get Home Timeline");
    let header = (userTimeline ? "User Timeline" : "Home Timeline");
    return e(
      "div",
      {className: "TimelineContainer " + this.state.className},
      e("h1",{className: "TimelineHeader"}, header),
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.handleClick,
        },
        buttonName
      ),
      ((isServerError) ? e(ServerError, null) : e(Timeline, {tweets: this.state.tweets}))
    );
  }
}

function ServerError(props) {
  return e(
    "div",
    {className: "ServerError"},
    "Unable to get home timeline, please try again later."
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

export function Timeline(props) {
  let tweets = _.map(props.tweets, Tweet);

  return e(
    "div",
    {className: "Timeline"},
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
