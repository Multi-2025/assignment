// Selectors // 选择器
var $quizQuestionText = $('.quiz .question .questionText'); // 问题文本选择器
var $quizQuestionOptions = $('.quiz .question .options'); // 问题选项选择器
var $quizProgress = $('.quiz progress'); // 进度条选择器
var $quizProgressDataCurrent = $('.quiz .progressData .current'); // 当前进度数据选择器
var $quizProgressDataLimit = $('.quiz .progressData .limit'); // 进度限制数据选择器
var $countdownTimer = $('.quiz .question .countdown-timer'); // 倒计时选择器

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
    }]
  }
}];

var currentQuestion = 0; // default starting value // 默认起始值
var totalScore = 0; // 用户总分数
var timer; // 计时器变量
var countdownInterval; // 倒计时间隔变量

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
    nextQuestion(); // 跳转到下一个问题
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
    question: currentQuestion,
    weight: selectedWeight
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
    '<p class="questionText">Quiz Complete! Here are the Results!</p>' +
    '<p class="questionText">Your Score is: ' + totalScore + '</p>'
  );
}

// Init render // 初始化渲染
$(function() {
  quizInit();
});
