const { readFile, writeFile, chmod } = require("fs/promises");

const backupFile = `${__filename}-backup`;

const main = async () => {
  const data = await readFile(__filename);

  await writeFile(backupFile, data);

  await chmod(backupFile, 0o400);

  return "done";
};

main()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
