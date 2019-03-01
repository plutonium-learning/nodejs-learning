const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('showMyName', () => {
  console.log(`My name is Siant`);
});

myEventEmitter.emit('showMyName');