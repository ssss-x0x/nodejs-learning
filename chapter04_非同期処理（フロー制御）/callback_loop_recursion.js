const fs = require("fs");

const writeFile = (i) => {
  if (i >= 100) return;

  const text = `write: ${i}`;

  fs.writeFile("./data.txt", text, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(text);
  writeFile(i + 1);
};

writeFile(0);
