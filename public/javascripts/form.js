// Selectors // 选择器
var $quizQuestionText = $('.quiz .question .questionText'); // 问题文本选择器
var $quizQuestionOptions = $('.quiz .question .options'); // 问题选项选择器
var $quizProgress = $('.quiz progress'); // 进度条选择器
var $quizProgressDataCurrent = $('.quiz .progressData .current'); // 当前进度数据选择器
var $quizProgressDataLimit = $('.quiz .progressData .limit'); // 进度限制数据选择器
var $countdownTimer = $('.quiz .question .countdown-timer'); // 倒计时选择器
var $leaderboard = $('.quiz .leaderboard'); // 排行榜选择器

var currentQuestion = 0; // default starting value // 默认起始值
var totalScore = 0; // 用户总分数
var timer; // 计时器变量
var countdownInterval; // 倒计时间隔变量
var userid = Date.now() + Math.floor(Math.random() * 1000); // 生成一个基于当前时间戳和随机数的用户ID
console.log('Generated UserID:', userid); // 打印生成的用户ID


// 初始化Socket.IO
var socket = io();

function quizInit() {
  $quizProgress.attr("max", questions.length); // 设置进度条的最大值
  $quizProgressDataLimit.html(questions.length); // 显示问题总数
  renderQuestion(); // 渲染问题

  // 连接到Socket.IO
  socket.on('connect', function() {
    console.log('Connected to server');
  });

  // 接收实时消息
  socket.on('message', function(data) {
    console.log('Message from server:', data);
  });

  // 接收排行榜数据
  socket.on('leaderboard', function(data) {
    showLeaderboard(data);
  });
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
    if (question.answers.type === 'range') {
      questionOptionItem =
        '<button class="quiz-opt range" data-weight="' +
        questionOptionText[i].weight + '">' +
        questionOptionText[i].text + '</button>';
    } else {
      questionOptionItem =
        '<button class="quiz-opt" data-weight="' +
        questionOptionText[i].weight + '">' +
        questionOptionText[i].text + '</button>';
    }
    optionsHtml.push(questionOptionItem); // 添加选项HTML
  }
  $quizQuestionOptions.html(optionsHtml.join('')); // 设置选项HTML
  $('.quiz button').click(recordAnswer); // 为按钮添加点击事件

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
      nextQuestion(); // 跳转到下一个问题
    }
  }, 1000); // 每秒更新一次

  timer = setTimeout(function() {
    clearInterval(countdownInterval); // 时间到清除倒计时
    if (currentQuestion < questions.length){
        nextQuestion(); // 跳转到下一个问题
    }
    else {
        showResults(); // 显示最后一个页面
    }
  }, 15000); // 15秒后跳转到下一个问题
}

// RECORD ANSWER // 记录答案
function recordAnswer() {
  var selectedWeight = parseInt($(this).data('weight')); // 获取所选项的权重
  totalScore += selectedWeight; // 增加权重到总分数
  clearTimeout(timer); // 用户回答时清除计时器
  clearInterval(countdownInterval); // 用户回答时清除倒计时

  // 向服务器发送消息
  socket.emit('answer', {
    userId: userid,
    question: currentQuestion,
    opt: $(this).text(),
    weight: selectedWeight,
    score: totalScore
  });
  nextQuestion(); // 跳转到下一个问题
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
    '<p class="questionText">Quiz Complete! Here are the Results!</p>' +
    '<p class="questionText">Your Score is: ' + totalScore + '</p>'
  );
  socket.emit('requestLeaderboard'); // 请求排行榜数据
}

// LEADERBOARD // 排行榜
function showLeaderboard(data) {
  console.log('Leaderboard Data:', data);
  var leaderboardHtml = '<h2>Leaderboard</h2><ol>';

  for (var i = 0; i < data.length; i++) {
    leaderboardHtml += '<li><span class="userId">' + data[i]._id + '</span><span class="lastScore">' + data[i].lastScore + '</span></li>';
  }
  leaderboardHtml += '</ol>';
  $leaderboard.html(leaderboardHtml);
}



// Init render // 初始化渲染
$(function() {
  quizInit();
});


// Data input for Questions and Results // 问题和结果的数据输入
var questions = [{
  text: '1. What’s your primary source of customer feedback?', // 你主要的客户反馈来源是什么？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Google Reviews', // A. Google评论
      weight: 1
    }, {
      text: 'B. Customer Service', // B. 客户服务
      weight: 2
    },{
      text: 'C. Social Media', // C. 社交媒体
      weight: 4
    },{
      text: 'D. Email', // D. 电子邮件
      weight: 3
    }]
  }
}, {
  text: '2. How would you rate your customer service?', // 你如何评价你的客户服务？
  answers: {
    type: 'multiple', // 范围
    options: [{
      text: 'Poor', // 差
      weight: 1
    }, {
      text: 'Fair', // 一般
      weight: 2
    },{
      text: 'Good', // 好
      weight: 3
    },{
      text: 'Excellent', // 优秀
      weight: 4
    }]
  }
}, {
  text: '3. How would you rate your product quality?', // 你如何评价你的产品质量？
  answers: {
    type: 'multiple', // 范围
    options: [{
      text: 'Poor', // 差
      weight: 1
    }, {
      text: 'Fair', // 一般
      weight: 2
    },{
      text: 'Good', // 好
      weight: 3
    },{
      text: 'Excellent', // 优秀
      weight: 4
    }]
  }
}, {
  text: '4. How likely are you to recommend us to a friend or colleague?', // 你会向朋友或同事推荐我们吗？
  answers: {
    type: 'multiple', // 范围
    options: [{
      text: 'Not Likely', // 不太可能
      weight: 1
    }, {
      text: 'Maybe', // 可能
      weight: 2
    },{
      text: 'Likely', // 可能
      weight: 3
    },{
      text: 'Very Likely', // 非常可能
      weight: 4
    }]
  }
}, {
  text: '5. How would you rate your overall experience with us?', // 你如何评价你与我们的整体体验？
  answers: {
    type: 'multiple', // 范围
    options: [{
      text: 'Poor', // 差
      weight: 1
    }, {
      text: 'Fair', // 一般
      weight: 2
    },{
      text: 'Good', // 好
      weight: 3
    },{
      text: 'Excellent', // 优秀
      weight: 4
    }]
  }
}
];