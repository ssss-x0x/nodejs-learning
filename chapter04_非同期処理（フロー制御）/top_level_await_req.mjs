import { request } from "undici";

console.time("request");

const requests = [];

for (let i = 0; i < 10; i++) {
  // リクエストを送るオブジェクトを生成する
  const req = request("http://localhost:3000").then((res) => {
    res.body.text();
  });
  requests.push(req);
}

// すべてのリクエストの完了を待つ
await Promise.all(requests);

console.timeEnd("request");
