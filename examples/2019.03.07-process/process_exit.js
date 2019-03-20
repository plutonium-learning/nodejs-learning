/**
 * 当Node.js进程由以下原因之一退出时,会触发'exit'事件:
 * - 显示调用process.exit()
 * - Node.js事件循环不需要执行任何其他工作
 * 此时无法阻止事件循环当退出,并且一旦所有的'exit'事件监听器执行完毕,Node.js进程将终止.
 * 
 * 通过process.exitCode属性或者传入`exitCode`参数到process.exit()方法调用回调函数.
 */
process.on('exit', (code) => {
  console.log(`退出码:${code}`);
});

// 打印: 退出码:500
process.exitCode = 500;

// 打印: 退出码:400
// process.exitCode = 400;