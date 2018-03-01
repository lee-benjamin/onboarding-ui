import {formatDate} from "./twitter.js";
import {getTwitterLink} from "./twitter.js";
import {getHomeTimeline} from "./twitter.js";
import * as _ from "lodash/core";

const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () => {
  getHomeTimeline(
    (tweets) => { // success
      ReactDOM.render(e(TimelineContainer, {tweets: tweets}),
        document.getElementById("root"));
      },
    () => { //failure
      ReactDOM.render(e(TimelineContainer, {isServerError: true}),
        document.getElementById("root"));
    }
  );
});

function ServerError(props) {
  return e(
    "div",
    {className: "ServerError"},
    "Unable to get home timeline, please try again later."
  );
}

class TimelineContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets: props.tweets, isServerError: props.isServerError};
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
    getHomeTimeline(this.successCallback, this.failureCallback);
  }

  render() {
    const isServerError = this.state.isServerError == true;
    return e(
      "div",
      {className: "TimelineContainer"},
      e("button",
        {
          className: "getHomeTimelineButton",
          onClick: this.handleClick,
        },
        "Get Home Timeline"
      ),
      ((isServerError) ? e(ServerError, null) : e(Timeline, {tweets: this.state.tweets}))
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
  let tweets = _.map(props.tweets, Tweet);

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
