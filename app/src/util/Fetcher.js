var Fetcher = (function () {
  const baseUrl = process.env.REACT_APP_ENODO_HUB_URI;
  const username = window.sessionStorage.getItem("username");
  const password = window.sessionStorage.getItem("password");
  return {
    fetchResource: function (path, cb) {
      fetch(baseUrl + "/api" + path, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      })
        .then((response) => response.json())
        .then((response) => cb(response.data));
    },
    setResource: function (path, data, cb, method) {
      let params = {
        method: method,
        body: JSON.stringify(data),
      };

      if (method === "GET") {
        delete params["body"];
      }
      fetch(baseUrl + path, params)
        .then((response) => response.json())
        .then((response) => cb(response.data));
    },
  };
})();

export default Fetcher;
