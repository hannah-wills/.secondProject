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

// ✅ Start the quiz when the Start button is clicked
startButton.addEventListener("click", () => {
  startButton.disabled = true;
  loadQuestions();
});
