# 事件触发器
> 文章内所有代码在GITHUB上可以找到: [nodejs-learning](https://github.com/plutonium-learning/nodejs-learning)
 
Node.js的核心API大多构建于惯用的异步事件驱动架构，其中某些类型的对象(被称为触发器, Emitter)会触发命名事件来调用函数(又称监听器，Listener)。
所有触发器对象都是EventEmitter的实例。这些对象都有一个eventEmitter.on()函数，用于将一个或多个函数绑定到命名时间上。通常，事件命名用驼峰式。如下面示例[代码](sample1.js)：
```javascript
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('showMyName', () => {
  console.log(`My name is Siant`);
});

myEventEmitter.emit('showMyName');
```
运行后可得到结果：
```shell
My name is Siant
```
这是一个简单的触发器例子，`MyEventEmitter`是`EventEmitter`的一个实例，并且绑定了事件`showMyName`，当`myEventEmitter`触发`showMyName`事件时，绑定的函数(监听器)被调用，打印出`My name is Siant`。

## 将参数和 this 传给监听器
eventEmitter.emit()可以传递任意数量的参数到监听器函数。
[代码](sample2.js)：
```javascript
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('event', (name) => {
  console.log(name);
  console.log(this === myEventEmitter);
  console.log(this);
});

myEventEmitter.emit('event', 'Conik');
```
运行可以看到：
```shell
Conik
false
{}
```
我么将监听器函数改成:
```javascript
function (name) {
  console.log(name);
  console.log(this === myEventEmitter);
  console.log(this);
}
```
再次运行：
```shell
Conik
true
MyEventEmitter {
  domain: null,
  _events: { event: [Function] },
  _eventsCount: 1,
  _maxListeners: undefined }
```
结果不一样了。这里官方给出的解释是：可以使用 ES6 的箭头函数作为监听器。但 `this` 关键词不会指向 `EventEmitter` 实例。

## 异步vs同步
`EventEmitter`会按照监听器注册的顺序同步地调用所有监听器。所以，确保事件顺序正确和避免竞争条件或错误的逻辑是很重要的。使用 `setImmediate()` 或 `process.nextTick()` 切换到异步模式：
```javascript
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
```
## 只处理事件一次
当一个监听器通过`eventEmitter.on()`注册后，监听器会在每次触发命名事件时被调用：
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter { };

const myEmitter = new MyEmitter();
let count = 0;

myEmitter.on('add', () => {
  console.log(++count);
});
myEmitter.emit('add');
// 打印: 1
myEmitter.emit('add');
// 打印: 2
```
使用 `eventEmitter.once()` 可以注册最多可调用一次的监听器。 当事件被触发时，监听器会被注销，然后再调用。
```javascript
myEmitter.once('add', () => {
  console.log(++count);
});
myEmitter.emit('add');
// 打印: 1
myEmitter.emit('add');
// 不打印
```

## 错误事件
`EventEmitter`实例出错时，应该触发`error`事件。
如果`EventEmitter`没有注册一个`error`监听器，并且`error`事件被触发了，会打抛错打印出堆栈跟踪随后Node.js进程退出
```javascript
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter { };

const myEmitter = new MyEventEmitter();
myEmitter.emit('error', new Error('错误信息'));
// 抛出错误
```
运行后控制台打印：
```shell
events.js:183
      throw er; // Unhandled 'error' event
      ^

Error: 错误信息
    at Object.<anonymous> (/Users/xulingming/Public/code_space/nodejs-learning/examples/2019.03.01-events/sample5.js:6:25)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
    at startup (bootstrap_node.js:191:16)
    at bootstrap_node.js:612:3
```
为了防止进程崩溃，最好的办法就是始终为`error`事件注册监听器:
```javascript
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('错误信息');
});
myEmitter.emit('error', new Error('错误信息'));
// 打印: 错误信息
```

## EventEmitter 类
`EventEmitter` 类由 `events` 模块定义：
```javascript
const EventEmitter = require('events');
```
当新增监听器时，会触发 'newListener' 事件；当移除已存在的监听器时，则触发 'removeListener' 事件。

### 'newListener'事件:
`EventEmitter` 实例在新的监听器被添加到其内部监听器数组之前，会触发自身的 'newListener' 事件。
在 'newListener' 回调中注册到相同 name 的任何其他监听器将插入到正在添加的监听器之前，
如下代码：
```javascript
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
```
PS: 不妨试试将上面的once改成on，你会得到以下结果：
```shell
events.js:1
(function (exports, require, module, __filename, __dirname) { // Copyright Joyent, Inc. and other Node contributors.
^

RangeError: Maximum call stack size exceeded
    at MyEventEmitter.emit (events.js:1:1)
    at _addListener (events.js:249:14)
    at MyEventEmitter.addListener (events.js:297:10)
```    
### 'removeListener' 事件
'removeListener' 事件在 listener 被移除后触发。

### EventEmitter.defaultMaxListeners
默认情况下，每个事件可以注册最多 10 个监听器。 可以使用 emitter.setMaxListeners(n) 方法改变单个 EventEmitter 实例的限制。 可以使用 EventEmitter.defaultMaxListeners 属性改变所有 EventEmitter 实例的默认值（可见这个影响是全局的使用当谨慎！）。EventEmitter 实例可以添加超过限制的监听器，但是会向 stderr 输出跟踪警告，表明检测到可能的内存泄漏。

### emitter.rawListeners(eventName)
返回 eventName 事件的监听器数组的拷贝，包括封装的监听器（例如由 .once() 创建的）。
需要注意这个方法是v9.4.0后新增的，在较低版本使用会报错。
代码：
```javascript
const EventEmitter = require('events');

const emitter = new EventEmitter();
emitter.once('log', () => console.log('只记录一次'));

// 返回一个数组，包含了一个封装了 `listener` 方法的监听器。
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 打印 “只记录一次”，但不会解绑 `once` 事件。
logFnWrapper.listener();

// 打印 “只记录一次”，且移除监听器。
logFnWrapper();

emitter.on('log', () => console.log('持续地记录'));
// 返回一个数组，只包含 `.on()` 绑定的监听器。
const newListeners = emitter.rawListeners('log');

// 打印两次 “持续地记录”。
newListeners[0]();
emitter.emit('log');
```


更多关于EventEmitter类的详细信息可参考官方API: https://nodejs.org/api/events.html。
- emitter.addListener(eventName, listener)
  emitter.on(eventName, listener) 的别名。
- emitter.emit(eventName[, ...args])
  按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
  如果事件有监听器，则返回 true，否则返回 false。
- emitter.eventNames()
  返回已注册监听器的事件名数组。 数组中的值为字符串或 Symbol。
- emitter.getMaxListeners()
  返回 EventEmitter 当前的监听器最大限制数的值，该值可以使用 emitter.setMaxListeners(n) 设置或默认为EventEmitter.defaultMaxListeners。
- emitter.listenerCount(eventName)
  返回正在监听的名为 eventName 的事件的监听器的数量。
- emitter.listeners(eventName)
  返回名为 eventName 的事件的监听器数组的副本。
- emitter.off(eventName, listener)
  emitter.removeListener() 的别名。
- emitter.on(eventName, listener)
- emitter.once(eventName, listener)
  添加单次监听器 listener 到名为 eventName 的事件。 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
- emitter.prependListener(eventName, listener)
  添加单次监听器 listener 到名为 eventName 的事件的监听器数组的开头。 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
- emitter.removeAllListeners([eventName])
  移除全部监听器或指定的 eventName 事件的监听器。
- emitter.removeListener(eventName, listener)  
- emitter.setMaxListeners(n)
- emitter.rawListeners(eventName)
