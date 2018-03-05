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
