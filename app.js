var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketIo = require('socket.io');
var fs = require('fs-extra');

var indexRouter = require('./routes/index');
var formRouter = require('./routes/form');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

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
app.use('/test', testRouter);

// File path for storing data locally
const dataFilePath = path.join(__dirname, 'data', 'answers.json');

// Ensure data directory exists
fs.ensureDirSync(path.dirname(dataFilePath));

// Function to read data from JSON file
async function readData() {
  try {
    return await fs.readJson(dataFilePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File does not exist, return empty array
      return [];
    } else {
      throw err;
    }
  }
}

// Function to write data to JSON file
async function writeData(data) {
  await fs.writeJson(dataFilePath, data);
}

// Serve questions.json to the client
var questionsFilePath = path.join(__dirname, 'data', 'questions.json');

app.get('/questions', (req, res) => {
  fs.readJson(questionsFilePath)
    .then(questions => {
      res.json(questions);
    })
    .catch(err => {
      console.error('Error reading questions file:', err);
      res.status(500).json({ error: 'Failed to load questions' });
    });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('a user connected'); // Print user connection info

  socket.on('answer', async (data) => { // Listen for 'answer' event from client
    console.log('Answer received:', data); // Print received answer data

    // Save answer to local JSON file
    try {
      const answers = await readData();
      answers.push(data);
      await writeData(answers);
      console.log('Answer saved locally'); // Print save success info
    } catch (err) {
      console.error('Error saving answer locally', err); // Print save error info
    }

    // Send answer back to client
    socket.emit('answer', data);
    console.log('Answer sent to client:', data); // Print sent answer data
  });

  socket.on('requestLeaderboard', async () => { // Listen for 'requestLeaderboard' event from client
    try {
      const answers = await readData();
      const leaderboard = answers.reduce((acc, answer) => {
        const existing = acc.find(item => item.userId === answer.userid);
        if (existing) {
          existing.lastScore = answer.score;
        } else {
          acc.push({ userId: answer.userId, username: answer.username, lastScore: answer.score });
        }
        return acc;
      }, []).sort((a, b) => b.lastScore - a.lastScore).slice(0, 10);

      socket.emit('leaderboard', leaderboard); // Send leaderboard data back to client
      console.log(leaderboard); // Print leaderboard data
    } catch (err) {
      console.error('Error fetching leaderboard', err); // Print fetch error info
    }
  });

  socket.on('disconnect', () => { // Listen for user disconnect event
    console.log('user disconnected'); // Print user disconnect info
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
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, server };
