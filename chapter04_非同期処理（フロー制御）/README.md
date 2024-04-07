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

---

# イベント駆動型の非同期フロー処理

## ストリーム処理（EventEmitter/Stream）

### EventEmitter

- 非同期フローの制御では処理の完了時にひとつのイベント（成功・失敗）に対して処理を行っていたが、ストリーム処理では「処理の開始」「処理の終了」「処理の途中」「処理の終了」「エラー発生」など、さまざまなタイミングで処理を行う。 -　イベント駆動型の処理は Node.js のコアにある「EventEmitter」や、EE を継承した「Stream」と呼ばれる基底クラスを継承し実装されている。
  - 参照: event_emitter_basic.js
- EventEmitter は何度も・細切れに発生する非同期なイベントを制御するための実装である。

### Stream

- Stream は EventEmitter にデータを溜め込む内部バッファを組み込んだもののイメージ
- 内部バッファに一定量のデータがたまるとイベントが発火する
- Stream オブジェクト同士を繋ぎ合わせることができるため、以下の恩恵が得られる
  - 溜まったデータを別の形式に変換する Stream を途中に接続することで、すべてのデータが溜まり切る前に変換可能なものから処理を始める動作が可能になる
  - すべてのデータをメモリ上に保持することはせずに処理するため、メモリの使用量を抑えやすい
- Node.js 自体がシングルスレッド・シングルプロセスで動作するため、I/O の処理をなるべく細かくすることがパフォーマンス上求められるので、Stream と相性が良い。

| Stream の種類 | できること                                                   |
| ------------- | ------------------------------------------------------------ |
| Writable      | データの書き込みに利用する（fs.createWriteStream など）      |
| Readable      | データの読み取りに利用する（fs.createReadStream など）       |
| Duplex        | 書き込み・読み取りの両方に対応する（net.Socket など）        |
| Transform     | Duplex を継承し、読み書きしたデータを変換する（zlib.create） |

- サーバーから HTTP リクエストをする際など、一度に大きなデータを取得する可能性のある処理を Stream 処理にすることで、恩恵がある
  - リスナーが呼び出されるまでの間に Node.js では別の処理をできる
  - データを小さく区切ることで一度に処理する量が減るため、ループが小さくなったり、より少ないメモリでの動作が可能になる

## AsyncIterator

AsyncIterator を利用して、Stream 処理における以下の課題を解決する。  
参照: async_iterator.js

- async/await などのフロー制御に組み込むことが難しい
- エラーハンドリングを忘れやすく、忘れた時の影響が大きい
- すべてが並行に処理されるため、順次処理したいという場面とは相性が悪い
  - 参照: stream_wait.js

```
for await (const 変数 of 非同期の反復可能オブジェクト) {
  ...
}
```

### 注意点

- 並列に処理できていものを直列に処理することで、パフォーマンスの劣化を招く場合もある。

## エラーハンドリングのまとめ

- Node.js はエラーハンドリングが漏れてプロセスのクラッシュが発生した場合、すべてのリクエストでエラーが発生してしまう。（複数リスエストを 1 プロセスで受け付けてしまうため）

| 同期/非同期 | 設計                 | エラーハンドリング                |
| ----------- | -------------------- | --------------------------------- |
| 同期処理    |                      | try-catch, async/await            |
| 非同期処理  | Callback             | エラーの null チェック: if(error) |
| 非同期処理  | EventEmitter(Stream) | emitter.on('error')               |
| 非同期処理  | async/await          | try-catch, .catch()               |
| 非同期処理  | AsyncIterator        | try-catch, .catch()               |

### Top-Level Await

- await は async 関数の中で原則は利用するが、モジュールのトップレベルスコープ（ECMA Script modules）で await で記述できる「Top-Level Await」が利用できる。
  - 参照: top_level_await.mjs, top_level_await_req.mjs
- CLI ツールなどを書く場合に活用する

### Top-Level Await と Async Iterator の注意点

- Top-Level Await, Async Iterator で受けた場合、request イベントの受け取りを都度待ち受ける処理となる。（EventEmitter では同時にリクエストを送信する）
- 前のリクエストが完了するまで次のリクエストが受け取れないため、サーバーの data イベントなどを受け取る処理などには適していない。
- 非同期に処理したいのか、リクエストを待ち受けたい処理なのか、適切な利用方法を意識して非同期処理の方法を使い分けることが必要。
