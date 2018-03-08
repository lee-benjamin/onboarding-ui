import * as twitter from "./services/twitter.js";
import * as _ from "lodash/core";

const e = React.createElement; // syntatical shorthand

document.addEventListener("DOMContentLoaded", () =>
  ReactDOM.render(e(ReactContainer, null), document.getElementById("root"))
);

class ReactContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {focusedComponent: HomeTimeline};

    // Bind functions
    this.focusedComponentListener = this.focusedComponentListener.bind(this);
  }

  focusedComponentListener(componentName) {
    let focusedComponent = null;
    switch(componentName) {
      case "User Timeline":
        focusedComponent = UserTimeline;
        break;
      case "Post Tweet":
        focusedComponent = PostTweet;
        break;
      default:
        focusedComponent = HomeTimeline; // Default View
    }
    this.setState({focusedComponent: focusedComponent});
  }

  render() {
    return e(
      "div",
      {className: "ReactContainer"},
      e(NavBar, {changeFocusedComponent: this.focusedComponentListener}),
      e(this.state.focusedComponent, null)
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const HomeTimeline = "Home Timeline";
    const UserTimeline = "User Timeline";
    const PostTweet = "Post Tweet";

    return e(
      "div",
      {className: "NavBar"},
      e(Tab, {changeFocusedComponent: this.props.changeFocusedComponent, tabName: HomeTimeline}),
      e(Tab, {changeFocusedComponent: this.props.changeFocusedComponent, tabName: UserTimeline}),
      e(Tab, {changeFocusedComponent: this.props.changeFocusedComponent, tabName: PostTweet}),
    );
  }
}

function Tab(props) {
  function onClick() {
    props.changeFocusedComponent(props.tabName);
  }

  return e(
    "button",
    {
      className: "Tab",
      onClick: onClick
    },
    props.tabName
  );
}

class PostTweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweetText:"", successMessage: ""};
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getMessageClass = this.getMessageClass.bind(this);
  }

  onClick() {
    twitter.postTweet(this.state.tweetText)
      .then((data) => this.setState({successMessage: "Post successful!"}))
      .catch((error) => this.setState({successMessage: "Unable to post tweet."}));
  }

  getMessageClass() {
    if (this.state.successMessage == "Unable to post tweet.") {
      return "";
    }
    return "green"
  }

  onChange(e) {
    this.setState({
      tweetText: e.target.value,
      successMessage: "",
    });
  }

  render() {
    const maxTweetLength = 280;
    return e(
      "div",
      {className: "PostTweet"},
      e("h1", {className: "Header"}, "Post a tweet"),
      e("div", {className: "tweetBoxCharCount"},
        e(
          "textarea",
          {
            onChange: this.onChange,
            maxLength: maxTweetLength
          },
        ),
        e("div", {className:"CharCount"}, this.state.tweetText.length),
        e(
          "button",
          {
            onClick: this.onClick,
            disabled: !this.state.tweetText.length,
            className: "PostTweetButton"
          },
          "Post Tweet"
        ),
        e(
          "span",
          {className: "successMessage " + this.getMessageClass()},
          this.state.successMessage
        )
      )
    );
  }
}

const chooseComponent = (isServerError, hasNoTweets) => {
  if (isServerError) {
    return ServerError;
  }

  if (hasNoTweets) {
    return NoTweets;
  }
  return Timeline;
}

class HomeTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getTweets();

    // Bind functions
    this.getTweets = this.getTweets.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.failureCallback = this.failureCallback.bind(this);
  }

  successCallback(tweets) {
    this.setState({tweets: tweets, isServerError: false});
  }

  failureCallback() {
    this.setState({isServerError: true});
    this.state.parentCallback(true);
  }

  getTweets() {
    twitter.getHomeTimeline()
      .then((data) => this.successCallback(data))
      .catch(() => this.failureCallback());
  }

  handleFilter(tweets) {
    if (tweets.length == 0) {
      this.setState({hasNoTweets: true});
    }
    else {
      this.setState({
        isServerError: false,
        hasNoTweets: false,
        tweets: tweets
      });
    }
  }

  render() {
    const isServerError = this.state.isServerError == true;
    const hasNoTweets = this.state.hasNoTweets == true;
    let component = chooseComponent(isServerError, hasNoTweets);

    return e(
      "div",
      {className: "TimelineContainer HomeTimeline"},
      e("h1",{className: "Header"}, "Home Timeline"),
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.getTweets,
        },
        "Get Home Timeline"
      ),
      e(SearchComponent, {failureCallback: this.failureCallback, onClick: this.handleFilter}),
      e(component, {tweets: this.state.tweets})
    );
  }
}

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onClick: props.onClick,
      filterQuery: "",
      failureCallback: props.failureCallback
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    twitter.filterHomeTimeline(this.state.filterQuery)
      .then((data) => {
        this.state.onClick(data);
      })
      .catch(() => this.state.failureCallback());
  }

  onChange(e) {
    this.setState({filterQuery: e.target.value});
  }

  render() {
    return e(
      "span",
      {className: "SearchComponent"},
      e(
        "input",
        {
          value: this.state.filterQuery,
          type: "text",
          className: "SearchBar",
          onChange: this.onChange
        }
      ),
      e(
        "button",
        {
          disabled: !this.state.filterQuery.length,
          onClick: this.onClick,
          className: "FilterButton"
        },
        "Filter Home Timeline"
      )
    );
  }
}

class UserTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getTweets();

    // Bind functions
    this.getTweets = this.getTweets.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.failureCallback = this.failureCallback.bind(this);
  }

  successCallback(tweets) {
    this.setState({
      tweets: tweets,
      isServerError: false,
      hasNoTweets: (tweets.length == 0 ? true : false)
    });
  }

  failureCallback() {
    this.setState({isServerError: true});
  }

  getTweets() {
    twitter.getUserTimeline()
      .then((data) => this.successCallback(data))
      .catch(() => this.failureCallback());
  }

  render() {
    const isServerError = this.state.isServerError == true;
    const hasNoTweets = this.state.hasNoTweets == true;
    let component = chooseComponent(isServerError, hasNoTweets);

    return e(
      "div",
      {className: "TimelineContainer UserTimeline"},
      e("h1",{className: "Header"}, "User Timeline"),
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.getTweets,
        },
        "Get User Timeline"
      ),
      e(component, {tweets: this.state.tweets})
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

function NoTweets(props) {
  return e(
    "div",
    {className: "NoTweets"},
    "Sorry, there are no tweets to be displayed."
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
    e("div", {className: "timeDiv"}, twitter.formatDate(props.tweet.createdAt)),
    e("a", {className: "tweetText", href: twitter.getTwitterLink(props.tweet), target: "_blank"},
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
