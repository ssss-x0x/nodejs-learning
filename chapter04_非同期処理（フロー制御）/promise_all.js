const { request } = require("undici");

const main = async () => {
  const resArray = await Promise.all([
    request("https://www.yahoo.co.jp/"),
    request("https://auctions.yahoo.co.jp/"),
    request("https://travel.yahoo.co.jp/"),
    request("https://shopping.yahoo.co.jp/?sc_e=ytmh"),
  ]);

  for (const res of resArray) {
    const body = await res.body.text();
    const titleArray = body.match(/<title>(.*?)<\/title>/) || [];
    const title = titleArray.length > 0 ? titleArray[1] : "タイトル不明";

    console.log(title);
  }

  return "done";
};

main()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
