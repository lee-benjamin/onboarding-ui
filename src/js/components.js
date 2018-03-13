import * as twitter from "./services/twitter.js";
import * as _ from "lodash/core";

const e = React.createElement; // syntatical shorthand

/*
 * A listener to render the default view on page load
 */
document.addEventListener("DOMContentLoaded", () =>
  ReactDOM.render(e(ReactContainer, null), document.getElementById("root"))
);

/*
 * React component that renders the NavBar and
 * whatever the focused component View is (User, Home, Post, etc).
 * Parent to the Tab component.
 */
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
      case Views.UserTimeline:
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
      e(NavBar,
        {
          changeFocusedComponent: this.focusedComponentListener
        }
      ),
      e(this.state.focusedComponent, null)
    );
  }
}

/*
 * An enum to define the labels of each view
 */
const Views = Object.freeze(
  {
    HomeTimeline: "Home Timeline",
    UserTimeline: "User Timeline",
    PostTweet: "Post Tweet"
  }
);

/*
 * The NavBar is the root navigational element and contains the Tabs
 */
class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {focusedTab: Views.HomeTimeline}; // Default view
    this.changeFocusedTab = this.changeFocusedTab.bind(this);
  }

  changeFocusedTab(componentName) {
    this.setState({focusedTab: componentName});
    this.props.changeFocusedComponent(componentName);
  }

  render() {
    return e(
      "div",
      {className: "NavBar"},
      e(Tab,
        {
          focusedTab: this.state.focusedTab,
          changeFocusedTab: this.changeFocusedTab,
          tabName: Views.HomeTimeline,
        }
      ),
      e(Tab,
        {
          focusedTab: this.state.focusedTab,
          changeFocusedTab: this.changeFocusedTab,
          tabName: Views.UserTimeline
        }
      ),
      e(Tab,
        {
          focusedTab: this.state.focusedTab,
          changeFocusedTab: this.changeFocusedTab,
          tabName: Views.PostTweet
        }
      )
    );
  }
}

/*
 * This component passes its name back to NavBar then to the
 * root component in order to dynamically render the focused
 * tab.
 */
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.changeFocusedTab(this.props.tabName);
  }

  render() {
    return e(
      "button",
      {
        className: "Tab" + (this.props.focusedTab == this.props.tabName ? " focused" : ""),
        onClick: this.onClick
      },
      this.props.tabName
    );
  }
}

/*
 * Represents the Post Tweet view
 */
class PostTweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweetText:"", resultMessage: ""};
    this.onChange = this.onChange.bind(this);
    this.postTweet = this.postTweet.bind(this);
  }

  postTweet() {
    if (this.props.replyTweet) { // a tweet to reply to has been passed in
      twitter.replyToTweet(this.props.replyTweet.id, this.state.tweetText)
        .then((data) => this.setState({resultMessage: "success"}))
        .catch((error) => this.setState({resultMessage: "failure"}));
    }
    else { // Post normally in absence of a replyTweet
      twitter.postTweet(this.state.tweetText)
        .then((data) => this.setState({resultMessage: "success"}))
        .catch((error) => this.setState({resultMessage: "failure"}));
    }
  }

  onChange(e) {
    this.setState({
      tweetText: e.target.value,
      resultMessage: "",
    });
  }

  render() {
    const maxTweetLength = 280;
    const tweetTextLength = (this.state.tweetText ? this.state.tweetText.length : 0);
    return e(
      "div",
      {className: "PostTweet"},
      e(
        "textarea",
        {
          onChange: this.onChange,
          maxLength: maxTweetLength
        },
      ),
      e("div", {className:"CharCount"}, tweetTextLength),
      e(
        "button",
        {
          onClick: this.postTweet,
          disabled: !tweetTextLength,
          className: "PostTweetButton"
        },
        "Post Tweet"
      ),
      e(
        "span",
        {className: "resultMessage " + this.state.resultMessage},
        (this.state.resultMessage == "" ?
          "" :(this.state.resultMessage == "success" ? "Post successful!" : "Unable to post tweet.")
        )
      )
    );
  }
}

/*
 * Component for the Home Timeline view
 */
class HomeTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {
        tweets: [],
        isServerError: false,
        isReplyModalOpen: false
      };
    this.getTweets();

    // Bind functions
    this.getTweets = this.getTweets.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.failureCallback = this.failureCallback.bind(this);
    this.openReplyModal = this.openReplyModal.bind(this);
    this.closeReplyModal = this.closeReplyModal.bind(this);
    this.chooseComponent = this.chooseComponent.bind(this);
  }

  openReplyModal(tweet) {
    this.setState({isReplyModalOpen: true, replyTweet: tweet});
  }

  closeReplyModal() {
    this.setState({isReplyModalOpen: false});
  }

  successCallback(tweets) {
    this.setState(
      {
        tweets: tweets,
        isServerError: false
      }
    );
  }

  failureCallback() {
    this.setState({isServerError: true});
  }

  getTweets() {
    twitter.getHomeTimeline()
      .then((data) => this.successCallback(data))
      .catch(() => this.failureCallback());
  }

  handleFilter(tweets) {
    this.setState(
      {
        isServerError: false,
        tweets: tweets
      }
    );
  }

  chooseComponent() { // returns proper component based on state flags
    if (this.state.isServerError) {
      return e(ServerError);
    }
    if (this.state.tweets && this.state.tweets.length) {
      return e(
        Timeline,
        {
          openReplyModal: this.openReplyModal,
          canReply: true,
          tweets: this.state.tweets
        });
    }
    return e(NoTweets);
  }

  render() {
    return e(
      "div",
      {className: "TimelineContainer HomeTimeline"},
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.getTweets,
        },
        "Get Home Timeline"
      ),
      e(SearchComponent, {failureCallback: this.failureCallback, onClick: this.handleFilter}),
      this.chooseComponent(), // The Timeline or an error page
      e(
        ReplyModal,
        {
          onClose: this.closeReplyModal,
          isOpen: this.state.isReplyModalOpen,
          replyTweet: this.state.replyTweet
        }
      )
    );
  }
}

/*
 * Component that adds filtering to the HomeTimeline View
 */
class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onClick: props.onClick,
      filterQuery: "",
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    twitter.filterHomeTimeline(this.state.filterQuery)
      .then((data) => {
        this.state.onClick(data);
      })
      .catch(() => this.props.failureCallback());
  }

  onChange(e) {
    this.setState({filterQuery: e.target.value});
  }

  render() {
    const filterQueryLength = (this.state.filterQuery ? this.state.filterQuery.length : 0);
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
          disabled: !filterQueryLength,
          onClick: this.onClick,
          className: "FilterButton"
        },
        "Filter Home Timeline"
      )
    );
  }
}

/*
 * Component that represents the User Timeline view
 */
class UserTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tweets: [], isServerError: false};
    this.getTweets();

    // Bind functions
    this.getTweets = this.getTweets.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.failureCallback = this.failureCallback.bind(this);
  }

  successCallback(tweets) {
    this.setState({
      tweets: tweets,
      isServerError: false
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
    return e(
      "div",
      {className: "TimelineContainer UserTimeline"},
      e("button",
        {
          className: "getTimelineButton",
          onClick: this.getTweets,
        },
        "Get User Timeline"
      ),
      (this.state.isServerError ?
        e(ServerError, null) :
        (this.state.tweets && this.state.tweets.length ? e(Timeline,{canReply: false, tweets: this.state.tweets}): e(NoTweets))
      )
    )
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


class Timeline extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let tweetComponents = _.map(this.props.tweets, (tweet) =>
      e(
        Tweet,
        {
          openReplyModal: this.props.openReplyModal,
          key: tweet.id,
          tweet: tweet,
          canReply: this.props.canReply
        }
      )
    );
    return e(
      "div",
      {className: "Timeline"},
      tweetComponents
    );
  }
}

class Tweet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      "div",
      {
        className: "Tweet",
        key: this.props.id
      },
      e(Avatar, {user: this.props.tweet.user}),
      e(
        TweetContent,
        {
          tweet: this.props.tweet,
          openReplyModal: this.props.openReplyModal,
          canReply: this.props.canReply
        }
      )
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

class TweetContent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.canReply) {
      // Calls HomeTimeline's openReplyModal,
      // passing this tweet as the tweet to be replied to
      this.props.openReplyModal(this.props.tweet);
    }
  }

  render() {
    return e(
      "div",
      {className: "TweetContent"},
      e("div", {className: "timeDiv"}, twitter.formatDate(this.props.tweet.createdAt)),
      e("a", {className: "tweetText", href: twitter.getTwitterLink(this.props.tweet), target: "_blank"},
        e("div", null, this.props.tweet.text)
      ),
      e(
        "div",
        {onClick: this.handleClick},
        e("i",{className: "fas fa-reply replyButton"})
      ),
   );
  }
}

class ReplyModal extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close(e) {
    e.preventDefault();

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return e(
      "div",
      {className: "ReplyModal"},
      e(
        "div",
        {className: "modalContent"},
        e("div", {onClick: this.close, className: "close"}, "×"),
        e("h2", {className: "modalHeader"}, "Reply to " + this.props.replyTweet.user.name),
        e(Tweet, {id: this.props.replyTweet.id, tweet: this.props.replyTweet}),
        e(PostTweet, {replyTweet: this.props.replyTweet}),
      ),
      e(
        "div",
        {
          className: "backdrop",
          onClick: this.close
        }
      )
    );
  }
}
