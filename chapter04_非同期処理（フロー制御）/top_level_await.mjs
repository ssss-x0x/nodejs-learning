import { readFile } from "fs/promises";

const data = await readFile("import.txt", "utf8");

console.log(data);
