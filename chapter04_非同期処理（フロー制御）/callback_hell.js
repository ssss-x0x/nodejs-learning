const { readFile, writeFile, chmod } = require("fs");

const backupFile = `${__filename}-${Date.now()}`;

readFile(__filename, (err, data) => {
  if (err) {
    return console.error(err);
  }

  writeFile(backupFile, data, (err) => {
    if (err) {
      return console.error(err);
    }

    chmod(backupFile, 0o440, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("done");
    });
  });
});
