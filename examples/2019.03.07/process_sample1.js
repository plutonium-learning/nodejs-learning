/**
 * 'beforeExit' 事件
 * 该段代码执行时, Node.js进程直接退出，
 * 退出时执行注册在'beforeExit'事件上的监听器函数。
 */
process.on('beforeExit', (code) => {
  console.log('Now in \'beforeExit\' event.');
  console.log(`Process exit code: ${code}`);
});