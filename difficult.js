document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let score = 0;
    let totalQuestions = 6;

    // Correct answers
    const correctAnswers = {
        question1diff: "Lake Baikal",
        question2diff: "Eye",
        question3diff: "7",
        question4diff: "Dragon Fruit",
        question5diff: "Cambrian Mountains",
        question6diff: "Germany" 
    };

    // Array to store incorrect answers for feedback
    let feedback = [];

    // Loop through each question
    for (let i = 1; i <= totalQuestions; i++) {
        const question = `question${i}diff`;
        const userAnswer = document.getElementById(question).value.trim();
        
        if (userAnswer) {
            if (userAnswer.toLowerCase() === correctAnswers[question].toLowerCase()) {
                score++;
            } else {
                feedback.push({
                    question: `Question ${i}`, // Format the question label
                    selected: userAnswer,
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
    let resultMessage = `Your score is: ${score}/${totalQuestions} (${percentage.toFixed(2)}%)\n\n`;

    // Display detailed feedback for incorrect answers
    if (feedback.length > 0) {
        resultMessage += "Review your answers:\n";
        feedback.forEach(item => {
            resultMessage += `- ${item.question}: Your answer was "${item.selected}". Correct answer: "${item.correct}".\n`;
        });
    } else {
        resultMessage += "Great job! All answers are correct.";
    }

    // Show result in alert
    alert(resultMessage);
});
