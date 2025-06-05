const startButton = document.getElementById("startButton");
const questionContainer = document.getElementById("question-container");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
let fetchedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

// Decode HTML entities from API
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// Load questions from API
const apiURL = "https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=boolean";

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

// Handle submit and leaderboard
document.getElementById("quiz-form").addEventListener("submit", function (event) {
  event.preventDefault();

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

  const playerName = prompt("Enter your name for the leaderboard:");
  if (playerName) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard_easy")) || [];
    leaderboard.push({
      name: playerName,
      score: score,
      total: fetchedQuestions.length,
      percent: percentage
    });

    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard_easy", JSON.stringify(leaderboard));
  }

  showQuizCompleteModal();
});

// Leaderboard generator
function generateLeaderboardHTML() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard_easy")) || [];
  let html = `<div class="leaderboard-wrapper"><h3>Leaderboard</h3><ol>`;

  leaderboard.slice(0, 10).forEach((entry, index) => {
    let icon = "";
    if (index === 0) icon = "🥇 ";
    else if (index === 1) icon = "🥈 ";
    else if (index === 2) icon = "🥉 ";

    html += `<li>${icon}${entry.name}: ${entry.score}/${entry.total} (${entry.percent.toFixed(1)}%)</li>`;
  });

  html += `</ol></div>`;
  return html;
}

// Show quiz complete modal
function showQuizCompleteModal() {
  const path = window.location.pathname;
  const container = document.getElementById("quizCompleteButtons");
  const modal = document.getElementById("quizCompleteContent");

  container.innerHTML = "";
  modal.querySelectorAll(".leaderboard-wrapper")?.forEach(el => el.remove());

  const tryAgainBtn = `<button onclick="window.location.reload();">🔁 Try Again</button>`;
  const homeBtn = `<button onclick="window.location.href='index.html';">🏠 Go Home</button>`;
  const intermediateBtn = `<button onclick="window.location.href='intermediate.html';">🟠 Try Intermediate</button>`;
  const difficultBtn = `<button onclick="window.location.href='difficult.html';">🔴 Try Difficult</button>`;

  container.innerHTML = `${tryAgainBtn}${intermediateBtn}${difficultBtn}${homeBtn}`;

  const leaderboardHTML = generateLeaderboardHTML();
  modal.innerHTML += `<div class="leaderboard-wrapper" style="margin-top: 2em;">${leaderboardHTML}</div>`;

  document.getElementById("quizCompleteModal").style.display = "flex";
}

// Start quiz
startButton.addEventListener("click", () => {
  startButton.disabled = true;
  loadQuestions();
});
