const { readFile } = require("fs");

try {
  readFile(__filename, (err, data) => {
    if (err) {
      console.error(err);
      return; // returnを忘れると次の処理に進んでしまう
    }

    console.log(data);
  });
} catch (err2) {
  // Callback内で発生したエラーはキャッチできない
  console.error(err2);
}
