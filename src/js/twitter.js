import {Timeline} from "./components.js";
import * as _ from "lodash/core";

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

export const getTimeline = (endpoint, successCallback, failureCallback) => {
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

export const getBothTimelines = (successCallback, failureCallback) => {
  const url = "http://localhost:8080/api/1.0/twitter/timeline/";
  let promises = [url+"home", url+"user"].map(url => fetch(url).then(resp => resp.json()));
  Promise.all(promises)
    .then((data) => {
      successCallback(data[0],data[1]);
    })
    .catch((error) => {
      console.log(error);
      failureCallback();
    });
}
