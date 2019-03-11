/**
 * 监听器函数必须只执行同步操作.Node.js进程会在调用'exit'事件监听器后立刻
 * 退出,导致任何还在事件循环队列中的其他工作被放弃.
 */
process.on('exit', (code) => {
  console.log(`exit code:${code}`);
});

process.on('exit', (code) => {
  setTimeout(() => {
    console.log(`I would not print the exit code:${code}`);
  });
});