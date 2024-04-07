const EventEmitter = require("events");

// EventEmitterの基底クラスを継承して、独自のイベントを扱うEventEmitterを作成
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("myEvent", (data) => {
  console.log("on myEvent", data);
});

myEmitter.emit("myEvent", "one");

setTimeout(() => {
  myEmitter.emit("myEvent", "two");
}, 1000);
