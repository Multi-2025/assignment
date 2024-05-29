// Selectors // 选择器
var $quizQuestionText = $('.quiz .question .questionText'); // 问题文本选择器
var $quizQuestionOptions = $('.quiz .question .options'); // 问题选项选择器
var $quizProgress = $('.quiz progress'); // 进度条选择器
var $quizProgressDataCurrent = $('.quiz .progressData .current'); // 当前进度数据选择器
var $quizProgressDataLimit = $('.quiz .progressData .limit'); // 进度限制数据选择器
var $countdownTimer = $('.quiz .question .countdown-timer'); // 倒计时选择器
var $leaderboard = $('.quiz .leaderboard'); // 排行榜选择器
var $startScreen = $('.quiz .start-screen'); // 开始屏幕选择器

var questions = [];
var currentQuestion = 0; // default starting value // 默认起始值
var totalScore = 0; // 用户总分数
var timer; // 计时器变量
var countdownInterval; // 倒计时间隔变量
var userid = Date.now() + Math.floor(Math.random() * 1000); // 生成一个基于当前时间戳和随机数的用户ID
var username = ''; // 用户名
console.log('Generated UserID:', userid); // 打印生成的用户ID

// Socket.IO
// 初始化Socket.IO
var socket = io();

function quizInit() {
  showStartScreen(); // 显示开始屏幕

  // 连接到Socket.IO
  socket.on('connect', function () {
    console.log('Connected to server');
  });

  // 接收实时消息
  socket.on('message', function (data) {
    console.log('Message from server:', data);
  });

  // 接收排行榜数据
  socket.on('leaderboard', function (data) {
    showLeaderboard(data);
  });

// Fetch questions from the server
  fetch('/questions')
      .then(response => response.json())
      .then(data => {
        questions = data;
        $quizProgress.attr("max", questions.length);
        $quizProgressDataLimit.html(questions.length);
      })
      .catch(error => console.error('Error fetching questions:', error));
}

// 显示开始屏幕
function showStartScreen() {
  $startScreen.html(`
    <div class="start-screen-content">
      <form id="start-form">
        <label for="username">Enter your name:</label>
        <input type="text" id="username" name="username" class="input-field">
        <button type="submit" id="start-quiz" class="submit-button">Start Quiz</button>
      </form>
    </div>
  `);
  $('#start-form').submit(function(event) {
    event.preventDefault();
    startQuiz();
  });
}


// 开始测验
function startQuiz() {
  username = $('#username').val();
  if (username.trim() === '') {
    alert('Please enter your name.');
    return;
  }
  $startScreen.hide();
  $('.quiz .question').show();
  $quizProgress.attr("max", questions.length); // 设置进度条的最大值
  $quizProgressDataLimit.html(questions.length); // 显示问题总数
  renderQuestion(); // 渲染问题
}

// RENDER // 渲染
function renderQuestion() {
  var question = questions[currentQuestion]; // 当前问题
  var optionsHtml = []; // 选项HTML数组
  var questionText = question.text; // 问题文本
  var questionOptionText = question.answers.options; // 问题选项文本
  $quizQuestionText.html(questionText); // 设置问题文本
  for (var i = 0; i < questionOptionText.length; i++) {
    var questionOptionItem = ''; // 问题选项
    questionOptionItem =
      '<button class="quiz-opt" data-weight="' +
      questionOptionText[i].weight + '">' +
      questionOptionText[i].text + '</button>';
    optionsHtml.push(questionOptionItem); // 添加选项HTML
  }
  $quizQuestionOptions.html(optionsHtml.join('')); // 设置选项HTML
  $('.quiz button.quiz-opt').click(recordAnswer); // 为按钮添加点击事件

  startTimer(); // 开始计时器
}

// TIMER // 计时器
function startTimer() {
  var timeLeft = 15; // 15秒倒计时
  $countdownTimer.html(timeLeft); // 设置倒计时显示
  clearInterval(countdownInterval); // 清除之前的倒计时间隔
  clearTimeout(timer); // 清除之前的计时器

  countdownInterval = setInterval(function() {
    timeLeft -= 1;
    $countdownTimer.html(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(countdownInterval); // 时间到清除倒计时
      showCorrectAnswer(); // 显示正确答案
      showNextButton(); // 显示跳转按钮
    }
  }, 1000); // 每秒更新一次

  timer = setTimeout(function() {
    clearInterval(countdownInterval); // 时间到清除倒计时
    showCorrectAnswer(); // 显示正确答案
    showNextButton(); // 显示跳转按钮
  }, 15000); // 15秒后跳转到下一个问题
}

// RECORD ANSWER // 记录答案
function recordAnswer() {
  var selectedWeight = parseInt($(this).data('weight')); // 获取所选项的权重
  var isCorrect = selectedWeight === 4; // 判断是否正确，权重为4的为正确答案
  totalScore += selectedWeight; // 增加权重到总分数
  clearTimeout(timer); // 用户回答时清除计时器
  clearInterval(countdownInterval); // 用户回答时清除倒计时

  // 向服务器发送消息
  socket.emit('answer', {
    userId: userid,
    username: username, // 添加用户名
    question: currentQuestion,
    opt: $(this).text(),
    weight: selectedWeight,
    score: totalScore
  });

  showCorrectAnswer(isCorrect); // 显示正确答案
  showNextButton(); // 显示跳转按钮
}

function showCorrectAnswer(isCorrect) {
  var question = questions[currentQuestion];
  var correctAnswer = question.answers.options.find(opt => opt.weight === 4);
  var message = isCorrect ? "Correct!\n" : "Incorrect!\n";
  var messageresult = "The correct answer is:  \n" ;
  var messageresult2 = correctAnswer.text;
  var messageColor = isCorrect ? "rgba(104,255,104,0.41)" : "rgba(255,0,0,0.56)";
  $quizQuestionOptions.html(`
    <h2 style="color: ${messageColor};">${message}</h2>
    <h3 style="color: ${messageColor};">${messageresult}${messageresult2}</h3>
  `);
}


// SHOW NEXT BUTTON // 显示跳转按钮
function showNextButton() {
  $quizQuestionOptions.append('<div style="text-align: right;">' +
    '<button id="next-question" style="\n' +
      '  background-color: rgba(53,150,188,0.62); \n' +
      '  border: none;\n' +
      '  color: white;\n' +
      '  padding: 20px 32px; /* 增加上下内边距 */\n' +
      '  text-align: center;\n' +
      '  text-decoration: none;\n' +
      '  display: inline-block;\n' +
      '  font-size: 16px;\n' +
      '  margin: 10px 2px; /* 增加上下外边距 */\n' +
      '  cursor: pointer;\n' +
      '  border-radius: 4px;\n' +
      '">Next Question</button>' +
    '</div>');
  $('#next-question').click(nextQuestion); // 添加点击事件
}


// HANDLER // 处理器
function nextQuestion() {
  currentQuestion += 1; // 当前问题加1
  $quizProgress.attr("value", currentQuestion); // 更新进度条的值
  $quizProgressDataCurrent.html(currentQuestion); // 更新当前进度文本
  if (questions.length === currentQuestion) {
    showResults(); // 显示最后一个页面
  } else {
    renderQuestion(); // 渲染下一个问题
  }
}

// RESULTS // 结果
function showResults() {
  $('.quiz .question').html(
    '<p class="questionText">Your ID: ' + userid + '</p>' +
    '<p class="questionText">Your Name: ' + username + '</p>' +
    '<p class="questionText">Quiz Complete! Here are the Results!</p>' +
    '<p class="questionText">Your Score is: ' + totalScore + '</p>'
  );
  socket.emit('requestLeaderboard'); // 请求排行榜数据
}

function showLeaderboard(data) {
  console.log('Leaderboard Data:', data);
  let leaderboardHtml = `
    <h2 style="font-size: 24px; color: #ffffff; text-align: center;">Leaderboard</h2>
    <ol style="list-style-type: none; padding: 0;">
      <li style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ccc; font-weight: bold;">
        <span class="username" style="flex: 1;">Username</span>
        <span class="userId" style="flex: 2;">User ID</span>
        <span class="lastScore" style="flex: 1; text-align: right;">Last Score</span>
      </li>
  `;

  // 循环生成每一行的HTML
  for (var i = 0; i < data.length; i++) {
    leaderboardHtml += `
      <li style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ccc;">
        <span class="username" style="flex: 1; font-weight: bold;">${data[i].username}</span>
        <span class="userId" style="flex: 2; font-weight: bold;">${data[i].userId}</span>
        <span class="lastScore" style="flex: 1; color: #666; text-align: right;">${data[i].lastScore}</span>
      </li>
    `;
  }

  leaderboardHtml += '</ol>';
  $leaderboard.html(leaderboardHtml);
}



// Init render // 初始化渲染
$(function() {
  $('.quiz .question').hide(); // 隐藏问题部分
  quizInit();
});
