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

export const getHomeTimeline = () => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/timeline/home";
    return fetch(url)
      .then((data) => data.json())
      .then((data) => resolve(data))
      .catch((error) => {
        reject(error.message);
      });
  });
}

export const getUserTimeline = () => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/timeline/user";
    return fetch(url)
      .then((data) => data.json())
      .then((data) => resolve(data))
      .catch((error) => {
        reject(error.message);
      });
  });
}

export const filterHomeTimeline = (query) => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/tweet/filter?keyword=";
    return fetch(url+query)
      .then((data) => data.json())
      .then((data) => resolve(data))
      .catch((error) => {
        reject(error.message);
      });
  });
}
