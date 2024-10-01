document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let score = 0;
    let totalQuestions = 6;

    // Correct answers
    const correctAnswers = {
        question1text: "4",
        question2intermediate: "A",
        question3intermediate: "B",
        question4intermediate: "A",
        question5intermediate: "B",
        question6intermediate: "C"
    };

    // Question 1 Intermediate (Text Input)
    const answer1 = document.getElementById('question1text').value.trim();
    if (answer1 === correctAnswers['question1text']) {
        score++;
    }

    // Question 2 Intermediate
    const q2Answer = document.querySelector('input[name="question2intermediate"]:checked');
    if (q2Answer && q2Answer.value === correctAnswers['question2intermediate']) {
        score++;
    }

    // Question 3 Intermediate
    const q3Answer = document.querySelector('input[name="question3intermediate"]:checked');
    if (q3Answer && q3Answer.value === correctAnswers['question3intermediate']) {
        score++;
    }

    // Question 4 Intermediate
    const q4Answer = document.querySelector('input[name="question4intermediate"]:checked');
    if (q4Answer && q4Answer.value === correctAnswers['question4intermediate']) {
        score++;
    }

    // Question 5 Intermediate
    const q5Answer = document.querySelector('input[name="question5intermediate"]:checked');
    if (q5Answer && q5Answer.value === correctAnswers['question5intermediate']) {
        score++;
    }

    // Question 6 Intermediate
    const q6Answer = document.querySelector('input[name="question6intermediate"]:checked');
    if (q6Answer && q6Answer.value === correctAnswers['question6intermediate']) {
        score++;
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Display result
    alert('Your score is: ' + score + '/' + totalQuestions + ' (' + percentage.toFixed(2) + '%)');
});