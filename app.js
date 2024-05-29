var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketIo = require('socket.io');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var formRouter = require('./routes/form');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');
const test = require("node:test");

// MongoDB connection
mongoose.connect("mongodb+srv://cr9294wjb:ufJ8ZItbzIaWPUyk@cluster0.ludq9fi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});



var app = express();
var server = http.createServer(app);
var io = socketIo(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/form', formRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter)




// Socket.IO
var Answer = require('./routes/Answer');
const {log} = require("debug"); // 引入答案数据模型
io.on('connection', (socket) => {
  console.log('a user connected'); // 打印用户连接信息

  socket.on('answer', async (data) => { // 监听客户端发送的答案事件
    console.log('Answer received:', data); // 打印接收到的答案数据

    // 将答案保存到 MongoDB
    const answer = new Answer(data);
    try {
      await answer.save();
      console.log('Answer saved to MongoDB'); // 打印保存成功信息
    } catch (err) {
      console.error('Error saving answer to MongoDB', err); // 打印保存失败错误信息
    }
    // 将答案发送回客户端
    socket.emit('answer', data);
    console.log('Answer sent to client:', data); // 打印发送的答案数据
  });

socket.on('requestLeaderboard', async () => { // 监听客户端请求排行榜事件
  try {
    const leaderboard = await Answer.aggregate([
      {
        $group: {
          _id: "$userId", // 按 userId 分组
          username: { $last: "$username" }, // Get the last username in each group
          lastScore: { $last: "$score" } // 获取每个分组中最后一个文档的 score 字段值
        }
      },
      { $sort: { lastScore: -1 } }, // 按最后一个分数降序排序
      { $limit: 10 } // 限制返回结果数量为 10
    ]);
    socket.emit('leaderboard', leaderboard); // 将排行榜数据发送回客户端
    console.log(leaderboard)  // 打印排行榜数据
  } catch (err) {
    console.error('Error fetching leaderboard', err); // 打印获取排行榜数据失败错误信息
  }
});

  socket.on('disconnect', () => { // 监听用户断开连接事件
    console.log('user disconnected'); // 打印用户断开连接信息
  });
});
// Socket.IO



console.log("http://localhost:3000");
console.log(" ");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };
