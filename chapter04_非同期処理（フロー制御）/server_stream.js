const http = require("http");

const server = http.createServer();

server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World from Stream");

  res.end();
});

server.on("error", (err) => {
  console.error(err);
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.write("Internal Server Error");

  res.end();
});

server.listen(3000);
