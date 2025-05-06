let timerInterval;
let timeRemaining = 60;
const timerElement = document.getElementById("time");
const startButton = document.getElementById("startButton");
const questionContainer = document.getElementById("question-container");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
let fetchedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

// Decode HTML entities from API (like &quot;)
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// API link for 10 medium-difficulty video game questions
const apiURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple";

// Load questions from API
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

// Display a single question
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

// Handle Next button
nextButton.addEventListener("click", () => {
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

  let score = 0;
  userAnswers.forEach((entry) => {
    if (entry.selected === entry.correct) {
      score++;
    }
  });

  const percentage = (score / fetchedQuestions.length) * 100;

  questionContainer.innerHTML = `
    <h3>Quiz Complete!</h3>
    <p>Your score: <strong>${score}/${fetchedQuestions.length}</strong> (${percentage.toFixed(1)}%)</p>
  `;

  submitButton.style.display = "none";
});

// Timer logic
function startTimer() {
  startButton.disabled = true;
  loadQuestions();

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = "Time's up!";
      nextButton.disabled = true;
    } else {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
      timeRemaining--;
    }
  }, 1000);
}

startButton.addEventListener("click", startTimer);
