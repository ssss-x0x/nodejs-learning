const { readFile, writeFile, chmod } = require("fs");

const readFileAsync = (path) => {
  return new Promise((resolve, reject) => {
    // テスト用にランダムにエラーを返す
    if (Math.random() > 0.7) {
      return reject(new Error("random error"));
    }

    readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

const writeFileAsync = (path, data) => {
  return new Promise((resolve, reject) => {
    // テスト用にランダムにエラーを返す
    if (Math.random() > 0.7) {
      return reject(new Error("random error"));
    }

    writeFile(path, data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const chmodAsync = (path, mode) => {
  return new Promise((resolve, reject) => {
    // テスト用にランダムにエラーを返す
    if (Math.random() > 0.7) {
      return reject(new Error("random error"));
    }

    chmod(path, mode, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const backupFile = `${__filename}-${Date.now()}`;

readFileAsync(__filename)
  .then((data) => {
    return writeFileAsync(backupFile, data);
  })
  .then(() => {
    return chmodAsync(backupFile, 0o400);
  })
  .catch((err) => {
    console.error(err);
  });
