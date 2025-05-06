// Declare variables to hold references to the timer and start button
let timerInterval;
let timeRemaining = 60; // Set the timer duration (in seconds)
const timerElement = document.getElementById('time'); // Timer display element
const startButton = document.getElementById('startButton'); // Start button

// Function to start the timer
function startTimer() {
  startButton.disabled = true; // Disable the start button when the timer starts

  // Start the timer countdown
  timerInterval = setInterval(function () {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval); // Stop the timer when it reaches zero
      timerElement.textContent = "Time's up!"; // Only display "Time's up!" when timer ends
    } else {
      let minutes = Math.floor(timeRemaining / 60);
      let seconds = timeRemaining % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Update timer display
      timeRemaining--; // Decrement the timer
    }
  }, 1000);
}

// Event listener for the start button
startButton.addEventListener('click', startTimer);



document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let score = 0;
    let totalQuestions = 6;

    // Array to store the correct answers
    const correctAnswers = {
        question1: 'A',
        question2: 'B',
        question3: 'B',
        question4: 'A',
        question5: 'A',
        question6: 'B'
    };

    // Array to store incorrect answers for feedback
    let feedback = [];

    // Loop through each question
    for (let i = 1; i <= totalQuestions; i++) {
        const question = `question${i}`;
        const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
        
        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswers[question]) {
                score++;
            } else {
                feedback.push({
                    question: `Question ${i}`, // Format the question label
                    selected: selectedAnswer.value,
                    correct: correctAnswers[question]
                });
            }
        } else {
            feedback.push({
                question: `Question ${i}`, // Format the question label
                selected: 'No answer selected',
                correct: correctAnswers[question]
            });
        }
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Display score
    let resultMessage = `Your score is: ${score}/${totalQuestions} (${percentage}%)\n\n`;

    // Display detailed feedback for incorrect answers
    if (feedback.length > 0) {
        resultMessage += "Review your answers:\n";
        feedback.forEach(item => {
            resultMessage += `- ${item.question}: Your answer was "${item.selected}". Correct answer: "${item.correct}".\n`;
        });
    } else {
        resultMessage += "Great job! All answers are correct.";
    }

    // Show result
    alert(resultMessage);
});
