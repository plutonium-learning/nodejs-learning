/**
 * Added in: v10.12.0
 * 
 * 只有在Promise处于以下情况时，`multipleResolves`事件就会触发:
 * 解决超过一次
 * 拒绝超过一次
 * 解决后拒绝
 * 拒绝后解决
 * 这在使用Promise构造的应用中跟踪错误很有用。否则，由于处于死区，这些错误会被静默的吞没。
 * 对于此类错误消息建议结束进程，因为该进程可能处于未定义状态。
 * 使用promise构造函数时，请确保每次调用时精确触发resolve()或reject()函数，并且永远不会在同一个调用中调用这两个函数。
 */
process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('第一次调用');
      resolve('吞没解决');
      reject(new Error('吞没解决'));
    });
  } catch {
    throw new Error('失败');
  }
}

main().then(console.log);
// resolve: Promise { '第一次调用' } '吞没解决'
// reject: Promise { '第一次调用' } Error: 吞没解决
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// 第一次调用