const fs = require("fs");

// 64 byteずつファイルを読み込むStreamを生成する
const stream = fs.createReadStream("./import.txt", { highWaterMark: 64 });

let counter = 0;

stream.on("data", (chunk) => {
  console.log(chunk.toString());
  counter++;
});

stream.on("close", () => {
  console.log("Finished!");
  console.log(`Read ${counter} chunks`);
});

stream.on("error", (err) => {
  console.error(err);
});
