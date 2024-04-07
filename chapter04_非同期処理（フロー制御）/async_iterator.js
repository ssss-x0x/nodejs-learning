const fs = require("fs");
const { writeFile } = require("fs/promises");

// 少し待つ非同期関数
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readFileName = "./import.txt";

const writeFileName = "./export_async.txt";

const write = async (chunk) => {
  // ランダムな秒数待つ
  await sleep(Math.floor(Math.random() * 1000));

  await writeFile(writeFileName, chunk, { flag: "a" });
};

const main = async () => {
  // 64 byteずつファイルを読み込むStreamを生成する
  const readStream = fs.createReadStream(readFileName, { highWaterMark: 64 });

  let counter = 0;

  // ここがAsyncIteratorの利用
  for await (const chunk of readStream) {
    console.log({ counter });
    counter++;

    await write(chunk);
  }
};

main().catch((error) => {
  console.error(error);
});
