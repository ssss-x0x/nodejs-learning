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
