    const timerElement = document.getElementById("time-left");
    let timeLeft = 45;
  
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
