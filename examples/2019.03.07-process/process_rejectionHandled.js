/**
 * Added in: v1.4.1
 * 
 * 每当Promise被拒绝并且错误处理程序附加到它（例如，使用promise.catch（））晚于一个Node.js事件循环时，就会发出'rejectionHandled'事件。
 * Promise对象之前已经在'unhandledRejection'事件中触发，但在处理过程中获得了拒绝处理函数。
 * Promise链中没有顶层的概念，拒绝总是可以被处理的。在本质上是异步的，Promise的拒绝可以在未来某个时间点处理，可能比触发'rejectionHandled'事件所需的事件循环更晚。
 * 也可以这样说，与同步代码中不断增长的未处理异常列表不同，使用Promise可能会有一个不断增长和缩小的未处理拒绝列表。
 * 在同步代码中，当未处理异常列表增长时就会触发'unhandledRejection'事件。
 * 在异步代码中，当未处理拒绝列表增长时会触发'unhandeldeRejection'事件，并且，当未处理拒绝列表缩减时会触发'rejectionHandled'事件。
 */

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  console.log(`增加未处理拒绝`);
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});