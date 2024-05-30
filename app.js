var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs-extra');

var indexRouter = require('./routes/index');
var formRouter = require('./routes/form');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

var app = express();

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


console.log('http://localhost:3000');
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


// Socket.IO setup
var http = require('http');
var server = http.createServer(app);
var socketIo = require('socket.io');
var io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('answer', async (data) => {
    console.log('Answer received:', data);

    // Save answer to local JSON file
    try {
      const answers = await readData();
      answers.push(data);
      await writeData(answers);
      console.log('Answer saved locally');
    } catch (err) {
      console.error('Error saving answer locally', err);
    }

    socket.emit('answer', data);
    console.log('Answer sent to client:', data);
  });

  socket.on('requestLeaderboard', async () => {
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

      socket.emit('leaderboard', leaderboard);
      console.log(leaderboard);
    } catch (err) {
      console.error('Error fetching leaderboard', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// Socket.IO

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.error(`404 error: ${req.originalUrl} not found`);
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
