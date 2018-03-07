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

export const postTweet = (tweet) => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/tweet";
    const obj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"message": tweet})
    }
    return fetch(url, obj)
       .then((data) => {
        if (data.status == 200) {
           resolve(data.json());
        }
        else {
          reject();
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

export const getHomeTimeline = () => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/timeline/home";
    return fetch(url)
       .then((data) => {
        if (data.status == 200) {
           resolve(data.json());
        }
        else {
          reject();
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

export const getUserTimeline = () => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/timeline/user";
    return fetch(url)
       .then((data) => {
        if (data.status == 200) {
           resolve(data.json());
        }
        else {
          reject();
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

export const filterHomeTimeline = (query) => {
  return new Promise((resolve, reject) => {
    const url = "http://localhost:8080/api/1.0/twitter/tweet/filter?keyword=";
    return fetch(url+query)
      .then((data) => {
        if (data.status == 200) {
           resolve(data.json());
        }
        else {
          reject();
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}
