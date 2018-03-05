import {formatDate} from "./twitter.js";
import {getTwitterLink} from "./twitter.js";
import {getHomeTimeline} from "./twitter.js";
import {getUserTimeline} from "./twitter.js";
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

  const getBothTimelines = (successCallback, failureCallback) => {
    let promises = [getHomeTimeline(), getUserTimeline()]
    Promise.all(promises)
      .then((data) => {
        successCallback(data[0],data[1]);
      })
      .catch((error) => {
        console.log(error);
        failureCallback();
      });
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
      e(HomeTimeline,
        {
          isServerError: this.state.isServerError,
          tweets: this.state.homeTweets
        }
      ),
      e(UserTimeline,
        {
          className: "UserTimeline",
          isServerError: this.state.isServerError,
          tweets: this.state.userTweets
        }
      )
    );
  }
}

class HomeTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets: props.tweets, isServerError: props.isServerError, className: "HomeTimeline"};
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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
    getHomeTimeline()
      .then((data) => this.successCallback(data))
      .catch(() => this.failureCallback());
  }

  handleFilter(e) {
    e.preventDefault();
    console.log("filter!");
  }

  render() {
    const isServerError = this.state.isServerError == true;
    return e(
      "div",
      {className: "TimelineContainer HomeTimeline"},
      e("h1",{className: "TimelineHeader"}, "Home Timeline"),
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.handleClick,
        },
        "Get Home Timeline"
      ),
      e(SearchComponent, {onClick: this.handleFilter}),
      ((isServerError) ? e(ServerError, null) : e(Timeline, {tweets: this.state.tweets}))
    );
  }
}

function SearchComponent(props) {
  return e(
    "div",
    {className: "SearchComponent"},
    e(
      "input",
      {type: "text", className: "SearchBar"}
    ),
    e(
      "button",
      {onClick: props.onClick, className: "FilterButton"},
      "Filter Home Timeline"
    )
  );
}

class UserTimeline extends React.Component {
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
    getUserTimeline()
      .then((data) => this.successCallback(data))
      .catch(() => this.failureCallback());
  }

  render() {
    const isServerError = this.state.isServerError == true;
    return e(
      "div",
      {className: "TimelineContainer UserTimeline"},
      e("h1",{className: "TimelineHeader"}, "User Timeline"),
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.handleClick,
        },
        "Get User Timeline"
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
    e("a", {className: "tweetText", href: getTwitterLink(props.tweet), target: "_blank"},
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
