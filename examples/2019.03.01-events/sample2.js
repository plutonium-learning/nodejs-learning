/**
 * 将参数和 this传递到监听器
 */
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('event',
  // (name) => {
  //   console.log(name);
  //   console.log(this === myEventEmitter);
  //   console.log(this);
  // }
  function (name) {
    console.log(name);
    console.log(this === myEventEmitter);
    console.log(this);
  }
);

myEventEmitter.emit('event', 'Conik');