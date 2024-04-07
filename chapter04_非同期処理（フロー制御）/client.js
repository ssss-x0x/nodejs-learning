const http = require("http");

// サーバーに対してリクエストするオブジェクトを生成
const req = http.request("http://localhost:3000", (res) => {
  res.setEncoding("utf8");

  // dataイベントを受け取る
  res.on("data", (chunk) => {
    console.log(`BODY: ${chunk}`);
  });

  // endイベントを受け取る
  res.on("end", () => {
    console.log("end");
  });
});

req.end();
