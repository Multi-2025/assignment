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
  var leaderboardHtml = `
    <h2 style="font-size: 24px; color: #ffffff; text-align: center;">Leaderboard</h2>
    <ol style="list-style-type: none; padding: 0;">
  `;

  for (var i = 0; i < data.length; i++) {
    leaderboardHtml += `
      <li style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ccc;">
        <span class="userId" style="font-weight: bold;">${data[i]._id}</span>
        <span class="lastScore" style="color: #666;">${data[i].lastScore}</span>
      </li>
    `;
  }
  leaderboardHtml += '</ol>';
  $leaderboard.html(leaderboardHtml);
}





// Init render // 初始化渲染
$(function() {
  quizInit();
});


var questions = [{
  text: '1. How many corners does the Shanghai International Circuit have?', // 上海国际赛车场有多少个弯？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. 20', // C. 20个
      weight: 2
    }, {
      text: 'B. 16', // A. 16个
      weight: 4
    }, {
      text: 'C. 22', // D. 22个
      weight: 1
    }, {
      text: 'D. 18', // B. 18个
      weight: 3
    }]
  }
}, {
  text: '2. Which team has won the most Constructors\' Championships?', // 哪个车队赢得了最多的车队冠军？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Ferrari', // A. 法拉利
      weight: 4
    }, {
      text: 'B. Mercedes', // C. 梅赛德斯
      weight: 2
    }, {
      text: 'C. Red Bull Racing', // D. 红牛车队
      weight: 1
    }, {
      text: 'D. McLaren', // B. 迈凯伦
      weight: 3
    }]
  }
}, {
  text: '3. In what year was the first Formula 1 World Championship held?', // 第一次F1世界锦标赛在哪一年举行？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. 1955', // A. 1950年
      weight: 1
    }, {
      text: 'B. 1960', // D. 1960年
      weight: 1
    }, {
      text: 'C. 1948', // B. 1948年
      weight: 2
    }, {
      text: 'D. 1950', // C. 1955年
      weight: 4
    }]
  }
}, {
  text: '4. Which circuit is known as the "Temple of Speed"?', // 哪条赛道被称为“速度圣殿”？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Spa-Francorchamps', // C. 斯帕-弗朗科尔尚赛道
      weight: 2
    }, {
      text: 'B. Monza', // A. 蒙扎
      weight: 4
    }, {
      text: 'C. Silverstone', // B. 银石赛道
      weight: 2
    }, {
      text: 'D. Suzuka', // D. 铃鹿赛道
      weight: 1
    }]
  }
}, {
  text: '5. Who was the youngest driver to win a Formula 1 race?', // 谁是最年轻的F1比赛冠军车手？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Sebastian Vettel', // B. 塞巴斯蒂安·维特尔
      weight: 3
    }, {
      text: 'B. Max Verstappen', // A. 马克斯·维斯塔潘
      weight: 4
    }, {
      text: 'C. Lewis Hamilton', // D. 刘易斯·汉密尔顿
      weight: 1
    }, {
      text: 'D. Fernando Alonso', // C. 费尔南多·阿隆索
      weight: 2
    }]
  }
}, {
  text: '6. Which driver tragically lost their life during the 1994 San Marino Grand Prix?', // 哪位车手在1994年圣马力诺大奖赛中不幸丧生？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Ayrton Senna', // A. 艾尔顿·塞纳
      weight: 4
    }, {
      text: 'B. Jochen Rindt', // D. 乔亨·林特
      weight: 1
    }, {
      text: 'C. Gilles Villeneuve', // C. 吉尔·维伦纽夫
      weight: 2
    }, {
      text: 'D. Roland Ratzenberger', // B. 罗兰德·拉岑伯格
      weight: 3
    }]
  }
}, {
  text: '7. Which tyre manufacturer is the current supplier for Formula 1?', // 目前F1的轮胎供应商是哪家？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Pirelli', // A. 倍耐力
      weight: 4
    }, {
      text: 'B. Goodyear', // D. 固特异
      weight: 1
    }, {
      text: 'C. Michelin', // B. 米其林
      weight: 2
    }, {
      text: 'D. Bridgestone', // C. 普利司通
      weight: 1
    }]
  }
}, {
  text: '8. Which driver won the 2021 Formula 1 World Championship?', // 哪位车手赢得了2021年F1世界锦标赛？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Sergio Perez', // D. 塞尔吉奥·佩雷兹
      weight: 1
    }, {
      text: 'B. Max Verstappen', // A. 马克斯·维斯塔潘
      weight: 4
    }, {
      text: 'C. Lewis Hamilton', // B. 刘易斯·汉密尔顿
      weight: 3
    }, {
      text: 'D. Valtteri Bottas', // C. 瓦尔特利·博塔斯
      weight: 2
    }]
  }
}, {
  text: '9. What is the maximum number of points a driver can earn in a single Grand Prix weekend (as of 2023)?', // 在2023年，车手在单个大奖赛周末最多可以获得多少积分？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. 24 points', // A. 26分
      weight: 2
    }, {
      text: 'B. 28 points', // D. 28分
      weight: 1
    }, {
      text: 'C. 25 points', // B. 25分
      weight: 3
    }, {
      text: 'D. 26 points', // C. 24分
      weight: 4
    }]
  }
}, {
  text: '10. Which driver is known as "The Professor" in Formula 1?', // 哪位车手在F1中被称为“教授”？
  answers: {
    type: 'multiple', // 多选
    options: [{
      text: 'A. Alain Prost', // A. 阿兰·普罗斯特
      weight: 4
    }, {
      text: 'B. Niki Lauda', // B. 尼基·劳达
      weight: 2
    }, {
      text: 'C. Nelson Piquet', // D. 内尔森·皮奎特
      weight: 1
    }, {
      text: 'D. Jackie Stewart', // C. 杰基·斯图尔特
      weight: 2
    }]
  }
}];
