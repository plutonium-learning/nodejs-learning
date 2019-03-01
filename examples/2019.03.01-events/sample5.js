/**
 * 处理错误
 */
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

// const myEmitter = new MyEventEmitter();
// myEmitter.emit('error', new Error('错误信息'));
// // 抛出错误

const myEmitter = new MyEventEmitter();
myEmitter.on('error', (err) => {
  console.error('错误信息');
});
myEmitter.emit('error', new Error('错误信息'));
// 打印: 错误信息