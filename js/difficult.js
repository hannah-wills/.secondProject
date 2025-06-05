let timerInterval;
let totalTime = 60;
let timeRemaining = totalTime;
let isTimeUp = false;
const timerElement = document.getElementById("time");
const startButton = document.getElementById("startButton");
const questionContainer = document.getElementById("question-container");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
let fetchedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

// Set up circular timer
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Decode HTML entities from API
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// Load questions from API
const apiURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=hard&type=multiple";

function loadQuestions() {
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      fetchedQuestions = data.results;
      displayQuestion(currentQuestionIndex);
      nextButton.style.display = "inline-block";
    })
    .catch((err) => console.error("API Error:", err));
}

// Display question
function displayQuestion(index) {
  const q = fetchedQuestions[index];
  const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

  questionContainer.innerHTML = `
    <div class="form-group">
      <label>${index + 1}. ${decodeHTML(q.question)}</label>
      ${answers
        .map(
          (ans, i) => `
        <div>
          <input type="radio" name="question" value="${decodeHTML(ans)}" id="q${index}a${i}" required />
          <label for="q${index}a${i}">${decodeHTML(ans)}</label>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Handle next
nextButton.addEventListener("click", () => {
  if (isTimeUp) {
    alert("Time is up! You can’t continue the quiz.");
    return;
  }

  const selected = document.querySelector('input[name="question"]:checked');
  if (!selected) {
    alert("Please select an answer before continuing.");
    return;
  }

  userAnswers.push({
    question: fetchedQuestions[currentQuestionIndex].question,
    selected: selected.value,
    correct: fetchedQuestions[currentQuestionIndex].correct_answer,
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < fetchedQuestions.length) {
    displayQuestion(currentQuestionIndex);
  } else {
    nextButton.style.display = "none";
    submitButton.style.display = "inline-block";
    questionContainer.innerHTML = `<p>All questions answered. Click Submit to see your results.</p>`;
  }
});


// Submit and score
document.getElementById("quiz-form").addEventListener("submit", function (event) {
  event.preventDefault();

  if (isTimeUp) {
    alert("You can’t submit — time has run out.");
    return;
  }

  clearInterval(timerInterval);

  let score = 0;
  userAnswers.forEach((entry) => {
    if (entry.selected === entry.correct) {
      score++;
    }
  });

  const percentage = (score / fetchedQuestions.length) * 100;

  let resultsHTML = `
  <h3>Quiz Complete!</h3>
  <p>Your score: <strong>${score}/${fetchedQuestions.length}</strong> (${percentage.toFixed(1)}%)</p>
  <hr>
`;

userAnswers.forEach((entry, index) => {
  const isCorrect = entry.selected === entry.correct;
  resultsHTML += `
    <div class="mb-3">
      <p><strong>Q${index + 1}:</strong> ${decodeHTML(entry.question)}</p>
      <p>Your answer: <span style="color:${isCorrect ? 'green' : 'red'}">${entry.selected || "None"}</span></p>
      ${!isCorrect ? `<p>Correct answer: <strong>${entry.correct}</strong></p>` : ""}
      <hr>
    </div>
  `;
});

questionContainer.innerHTML = resultsHTML;
submitButton.style.display = "none";

});

// Start timer
function startTimer() {
  startButton.disabled = true;
  loadQuestions();

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = "Time's up!";
      setProgress(0);
      isTimeUp = true;

      document.getElementById("timesUpModal").style.display = "flex";

      // Disable buttons
      nextButton.disabled = true;
      submitButton.disabled = true;

      // Optional: add fade or visual indicator
    } else {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

      const percent = (timeRemaining / totalTime) * 100;
      setProgress(percent);
      timeRemaining--;
    }
  }, 1000);
}


startButton.addEventListener("click", startTimer);
