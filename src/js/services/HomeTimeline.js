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
