// ランダムにresolveまたはrejectする
const promiseFunc = new Promise((resolve, reject) => {
  const rand = Math.random() * 10;

  if (rand > 5) {
    return reject("Promise rejected");
  }

  resolve("Promise resolved");
});

promiseFunc
  .then((value) => {
    console.log(value);
  })
  .catch((value) => {
    console.log(value);
  })
  .finally(() => {
    console.log("Promise end");
  });
