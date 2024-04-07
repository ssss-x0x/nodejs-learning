# 同期処理と非同期処理

- Node.js ではイベントループをいかに長時間停止させないかが大事
- 同期処理（非同期以外の処理）はイベントループを停止させる
- Node.js における非同期処理は libuv というクロスプラットフォーム向けのライブラリから提供されている

| 機能            | 実装  | 同期・非同期              |
| --------------- | ----- | ------------------------- |
| JSON operation  | V8    | 同期                      |
| Array operation | V8    | 同期                      |
| File I/O        | libuv | 非同期（Sync 関数を除く） |
| Child process   | libuv | 非同期（Sync 関数を除く） |
| Timer           | libuv | 非同期                    |
| TCP             | libuv | 非同期                    |

## Callback

- JavaScript の非同期制御で一番古くから利用されているのがコールック
- 処理が終わった時に呼び出される関数を登録するためのインターフェース

```
readFile(__filename, Callback)
```

- Callback を入れ子にして深くする（いわゆるコールバック地獄）のはアンチパターン。
  - 参照: callback_hell.js
- ループの順番は担保されないので、再帰処理などを利用することで順序を矯正することができる。
  - 参照: callback_loop.js, callback_loop_recursion.js
- Callback 関数の第一引数がエラーオブジェクトとなるため、null チェックのエラーハンドリングが必要
  - 参照: callback_error.js

## Promise

- Callback が抱えていた入れ子が深くなる・包括的なエラーハンドリングを行えないなどの弱点を解消するのが Promise オブジェクト
- 非同期処理が完了したタイミングで、Promise は成功｜失敗を返却する。
- then, catch は繋ぐこともできる。
  - 参照: promise_basic.js, promise_chain.js

### Callback の Promise 化

Callback のコードを Promise 化することで以下の恩恵が得られる

- 入れ子が深くならない
- どの関数でエラーが発生したかの捕捉ができるようになる
  - 参照: callback_to_promise.js

### promisify を使ってよりシンプルに Callback を Promise 化する

以下の慣例に従った Callback 関数を Promise 化できる

- API の最後の引数が callback
- Callback の第一引数がエラーオブジェクト
- 処理の完了時に一度だけ呼ばれる Callback 関数
  - 参照: callback_to_promisify.js

### 標準の Promise インターフェースを使う

- fs のような標準モジュールには最初から Promise のインターフェースが実装されているケースがある。存在すればそっちを使うのが一番簡潔。
  - 参照: callback_to_promise_interface.js

## async/await

- ループや条件分岐など、Promise では記述しにくい処理をさらに記述しやすくするシンタックスシュガーとして async/await が登場した。
- Promise を利用した非同期処理を同期的な見た目で記述できる。
  - 参照: async_await_basic.js, promise_to_async_await.js

### Promise と async/await を使った並列実行

- 前後関係がない処理は Promise.all を使って並列に実行することで、処理の完了までの時間を早められる。
