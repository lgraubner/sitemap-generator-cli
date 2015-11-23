var http = require("http");

module.exports = {
    "/": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/html"
            });
        res.write("<a href=\"/site\">Link 1</a><a href=\"/ignore\">Link 2</a>");
        res.end();
    },

    "/ignore": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/html"
            });
        res.write("this should be ignored!");
        res.end();
    },

    "/site": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/html"
            });
        res.write("<a href=\"/site/2\">Link 2</a>");
        res.end();
    },

    "/site/2": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/html"
            });
        res.write("<a href=\"/site/?foo=bar\"");
        res.end();
    },

    "/site/?foo=bar": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/html"
            });
        res.write("query");
        res.end();
    },

    "/robots.txt": function(req, res) {
        res.writeHead(
            200,
            http.STATUS_CODES[200], {
                "Content-Type": "text/plain"
            });

        res.write("User-agent: *\nDisallow: /ignore");
        res.end();
    }
};
