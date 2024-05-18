var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var formRouter = require('./routes/form');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');
const test = require("node:test");

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


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('answer', (data) => {
    console.log('Answer received:', data);
    // 可以在这里处理答案数据，比如存储到数据库或进行实时分析
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

/*
io.on('connection', (socket) => {
  console.log('A user connected');

  // 添加一个简单的事件测试消息传递
  socket.on('testEvent', (data) => {
    console.log('Received testEvent with data:', data);
    socket.emit('testResponse', 'Response from server');
  });

  socket.on('nextQuestion', (currentQuestionIndex) => {
    io.emit('updateQuestion', currentQuestionIndex + 1);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
*/

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
