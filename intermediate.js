document.addEventListener("DOMContentLoaded", function () {
    const timerElement = document.getElementById("time-left");
    let timeLeft = 30;
  
    // Timer interval (updates every second)
    const timerInterval = setInterval(function () {
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Stop the timer when it hits 0
        alert("Time's up!");
        document.getElementById("quiz-form").submit(); // Submit the form when time is up
      } else {
        timerElement.textContent = timeLeft; // Update the timer display
        timeLeft--;
      }
    }, 1000);
  
    // Handle form submission
    document.getElementById("quiz-form").addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission
  
      let score = 0;
      let totalQuestions = 6;
  
      // Correct answers for intermediate quiz
      const correctAnswers = {
        question1text: "4", // Example answer
        question2intermediate: "A", // Iron
        question3intermediate: "B", // Venus
        question4intermediate: "A", // Venezuela
        question5intermediate: "B", // May
        question6intermediate: "C"  // Three
      };
  
      // Check answers
      const userAnswers = {
        question1text: document.getElementById("question1text").value.trim(),
        question2intermediate: document.querySelector('input[name="question2intermediate"]:checked'),
        question3intermediate: document.querySelector('input[name="question3intermediate"]:checked'),
        question4intermediate: document.querySelector('input[name="question4intermediate"]:checked'),
        question5intermediate: document.querySelector('input[name="question5intermediate"]:checked'),
        question6intermediate: document.querySelector('input[name="question6intermediate"]:checked')
      };
  
      for (let question in correctAnswers) {
        const answer = userAnswers[question];
        if (answer && (answer.value || answer === correctAnswers[question])) {
          score++;
        }
      }
  
      // Calculate percentage
      let percentage = (score / totalQuestions) * 100;
  
      // Show result (you can modify this to show results elsewhere)
      alert(`Your score: ${score} out of ${totalQuestions} (${percentage}%)`);
    });
  });
  