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

    // Iterate over each question
    for (let question in correctAnswers) {
        const userAnswer = document.getElementById(question).value.trim();
        if (userAnswer.toLowerCase() === correctAnswers[question].toLowerCase()) {
            score++;
        }
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Display result
    alert('Your score is: ' + score + '/' + totalQuestions + ' (' + percentage.toFixed(2) + '%)');
});