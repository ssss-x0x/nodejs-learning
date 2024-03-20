const fs = require("fs");

for (let i = 0; i < 100; i++) {
  const text = `write: ${i}`;

  fs.writeFile("./data.txt", text, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  console.log(text);
}
