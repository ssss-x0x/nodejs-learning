const childFunc = (value) => {
  if (value > 5) {
    throw new Error("over 5");
  }
  return true;
};

// ランダムにresolveまたはrejectする
const promiseFunc = new Promise((resolve, reject) => {
  const rand = Math.random() * 10;

  childFunc(rand);

  resolve("Promise resolved");
});

promiseFunc
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Promise end");
  });
