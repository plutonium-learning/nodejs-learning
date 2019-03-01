const EventEmitter = require('events');

class MyEmitter extends EventEmitter { };

const myEmitter = new MyEmitter();
let count = 0;

myEmitter.on('add', () => {
  console.log(++count);
});

// myEmitter.once('add', () => {
//   console.log(++count);
// });

myEmitter.emit('add');
// 打印: 1
myEmitter.emit('add');
// 打印: 2

