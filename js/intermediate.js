let timerInterval;
let totalTime = 80;
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

// Circular timer setup
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Decode HTML from API
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// Load questions
const apiURL = "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple";

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

// Show one question
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

// Leaderboard generator (used in multiple places)
function generateLeaderboardHTML() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  let leaderboardHTML = `<div class="leaderboard-wrapper"><h3>Leaderboard</h3><ol>`;

  leaderboard.slice(0, 10).forEach((entry, index) => {
    let icon = "";
    if (index === 0) icon = "🥇 ";
    else if (index === 1) icon = "🥈 ";
    else if (index === 2) icon = "🥉 ";

    leaderboardHTML += `<li>${icon}${entry.name}: ${entry.score}/${entry.total} (${entry.percent.toFixed(1)}%) – ${entry.time}s</li>`;
  });

  leaderboardHTML += `</ol></div>`;
  return leaderboardHTML;
}

// Show quiz complete modal
function showQuizCompleteModal() {
  const path = window.location.pathname;
  const container = document.getElementById("quizCompleteButtons");
  const modal = document.getElementById("quizCompleteContent");

  container.innerHTML = ""; // Clear buttons
  modal.querySelectorAll(".leaderboard-wrapper")?.forEach(el => el.remove()); // Clean up leaderboard if already shown

  const tryAgainBtn = `<button onclick="window.location.reload();">🔁 Try Again</button>`;
  const homeBtn = `<button onclick="window.location.href='index.html';">🏠 Go Home</button>`;
  const easyBtn = `<button onclick="window.location.href='easy.html';">🟢 Try Easy</button>`;
  const difficultBtn = `<button onclick="window.location.href='difficult.html';">🔴 Try Difficult</button>`;

  if (path.includes("easy")) {
    container.innerHTML = `${tryAgainBtn}${intermediateBtn}${difficultBtn}${homeBtn}`;
  } else if (path.includes("difficult")) {
    container.innerHTML = `${tryAgainBtn}${easyBtn}${intermediateBtn}${homeBtn}`;
  } else {
    container.innerHTML = `${tryAgainBtn}${easyBtn}${difficultBtn}${homeBtn}`;
  }

  const leaderboardHTML = generateLeaderboardHTML();
  modal.innerHTML += `<div class="leaderboard-wrapper" style="margin-top: 2em;">${leaderboardHTML}</div>`;

  document.getElementById("quizCompleteModal").style.display = "flex";
}

// Handle next button
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

// Handle submit
document.getElementById("quiz-form").addEventListener("submit", function (event) {
  event.preventDefault();

  if (isTimeUp) {
    alert("You can’t submit — time has run out.");
    return;
  }

  clearInterval(timerInterval);

  const timeTaken = totalTime - timeRemaining;

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
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({
      name: playerName,
      score: score,
      total: fetchedQuestions.length,
      percent: percentage,
      time: timeTaken
    });    
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // sort by score descending
      } else {
        return a.time - b.time;   // if score tied, shorter time wins
      }
    });    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  showQuizCompleteModal();
});

// Start the timer
function startTimer() {
  startButton.disabled = true;
  loadQuestions();

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      const timeTaken = totalTime - timeRemaining;
      timerElement.textContent = "Time's up!";
      setProgress(0);
      isTimeUp = true;

      document.getElementById("timesUpModal").style.display = "flex";
      nextButton.disabled = true;
      submitButton.disabled = true;
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
