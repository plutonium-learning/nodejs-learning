/**
 * `newListener`事件
 */
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEmitter = new MyEventEmitter();
// 只处理一次，避免无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在前面插入一个监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A