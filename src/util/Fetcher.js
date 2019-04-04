var Fetcher = (function () {
    const baseUrl = "http://0.0.0.0:8080";
    return {
        fetchResource: function (path, cb) {
            fetch(baseUrl + path, {
                method: 'GET',
            }).then(response => response.json())
                .then(response => cb(response.data));
        },
        setResource: function (path, data, cb, method) {
            console.log(method);
            let params = {
                method: method,
                body: JSON.stringify(data)
            };

            if (method === "GET") {
                delete params['body'];
            }
            fetch(baseUrl + path, params).then(response => response.json())
                .then(response => cb(response.data));
        }
    };
})();

export default Fetcher;