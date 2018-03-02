import {Timeline} from "./components.js";

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

export const getTimeline2 = (endpoint, successCallback, failureCallback) => {
  const url = "http://localhost:8080/api/1.0/twitter/timeline/" + endpoint;
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      successCallback(data);
    })
    .catch((error) => {
      console.log(error);
      failureCallback();
    });
}

//export const getTimeline = (successCallback, failureCallback) => {
//  const url = "http://localhost:8080/api/1.0/twitter/timeline/";
//  fetch(url + "home")
//    .then((data) => data.json())
//    .then((homeTweets) =>  fetch(url + "user")
//    .then((userTweets,homeTweets) => {
//      successCallback(userTweets, homeTweets);
//    })
//    .catch((error) => {
//      console.log(error);
//      failureCallback();
//    });
//}
