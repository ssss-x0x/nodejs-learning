const fs = require("fs");
const { writeFile } = require("fs/promises");

// 少し待つ非同期関数
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readFileName = "./import.txt";
// 64 byteずつファイルを読み込むStreamを生成する
const readStream = fs.createReadStream(readFileName, { highWaterMark: 64 });

const writeFileName = "./export.txt";

const write = async (chunk) => {
  // ランダムな秒数末
  await sleep(Math.floor(Math.random() * 10000));

  await writeFile(writeFileName, chunk, { flag: "a" });
};

let counter = 0;
readStream.on("data", async (chunk) => {
  console.log({ counter });
  counter++;

  await write(chunk);
});

readStream.on("close", () => {
  console.log("Finished!");
  console.log(`Read ${counter} chunks`);
});

readStream.on("error", (err) => {
  console.error(err);
});
