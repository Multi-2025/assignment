const questions = [
  {
    text: "1. 你喜欢哪种水果？",
    options: ["A. 苹果", "B. 香蕉", "C. 橙子", "D. 葡萄"]
  },
  {
    text: "2. 你喜欢的季节是？",
    options: ["A. 春季", "B. 夏季", "C. 秋季", "D. 冬季"]
  },
  {
    text: "3. 你通常选择的交通工具是？",
    options: ["A. 公交车", "B. 自行车", "C. 私家车", "D. 步行"]
  }
];

let currentQuestionIndex = 0;
let countdownTimer;
const userAnswers = {}; // 存储用户选择的对象

function loadQuestion(index) {
  const question = questions[index];
  const questionContainer = document.getElementById("questionContainer");
  questionContainer.innerHTML = `
    <label>${question.text}</label>
    ${question.options.map((option, i) => `
      <div class="custom-control custom-radio">
        <input type="radio" id="option${index + 1}${i + 1}" name="question${index + 1}" class="custom-control-input" value="${option.charAt(0)}">
        <label class="custom-control-label" for="option${index + 1}${i + 1}">${option}</label>
      </div>
    `).join('')}
  `;
  resetTimer();
  hideNextButton();
}

function resetTimer() {
  clearInterval(countdownTimer);
  let timeLeft = 15;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `倒计时: ${timeLeft}秒`;

  countdownTimer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `倒计时: ${timeLeft}秒`;
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      goToNextQuestion();
    }
  }, 1000);
}

function showNextButton() {
  document.getElementById("nextButton").style.display = "inline-block";
}

function hideNextButton() {
  document.getElementById("nextButton").style.display = "none";
}

function showSubmitButton() {
  document.getElementById("submitButton").style.display = "inline-block";
}

function goToNextQuestion() {
  saveAnswer(); // 在跳到下一题之前保存当前选择
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion(currentQuestionIndex);
  } else {
    document.getElementById("questionContainer").innerHTML = '<p>问卷已完成，谢谢您的参与！</p>';
    hideNextButton();
    showSubmitButton();
    document.getElementById("timer").style.display = "none";
  }
}

function saveAnswer() {
  const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex + 1}"]:checked`);
  if (selectedOption) {
    userAnswers[currentQuestionIndex] = selectedOption.value;
  }
}

function getUserAnswers() {
  return userAnswers;
}

document.getElementById("surveyForm").addEventListener("change", () => {
  showNextButton();
});

document.getElementById("nextButton").addEventListener("click", () => {
  goToNextQuestion();
});

// 初始化加载第一个问题
loadQuestion(currentQuestionIndex);

// 提交按钮点击事件，展示用户的选择
document.getElementById("submitButton").addEventListener("click", () => {
  console.log(getUserAnswers()); // 打印用户选择的答案，可以根据需要进行处理
});
