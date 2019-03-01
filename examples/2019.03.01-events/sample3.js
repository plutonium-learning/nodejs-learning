/**
 * 异步vs同步
 */
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEmitter = new MyEventEmitter();

myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('这是异步发生的');
  });
  console.log(a, b);
});

myEmitter.emit('event', 'a', 'b');