async function someFunc() {
  await someOtherFunc("foo");
  await someOtherFunc("bar");
  await someOtherFunc("baz");
}

const someFuncAllow = async () => {
  await someOtherFunc("someFuncAllow");
};

async function someOtherFunc(func) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(func);
      // テスト用にランダムにrejectする
      if (Math.random() < 0.2) {
        return reject(`${func} rejected`);
      }
      resolve(`${func} resolved`);
    }, 200);
  });
}

async function exec() {
  try {
    await someFunc();
    await someFuncAllow();
  } catch (error) {
    console.error(error);
  }
}

exec();
