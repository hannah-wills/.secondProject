document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let score = 0;
    let totalQuestions = 6;

    // Question 1 Easy
    const q1Answer = document.querySelector('input[name="question1"]:checked');
    if (q1Answer && q1Answer.value === 'A') {
        score++;
    }

    // Question 2 Easy
    const q2Answer = document.querySelector('input[name="question2"]:checked');
    if (q2Answer && q2Answer.value === 'B') {
        score++;
    }

    // Question 3 Easy
    const q3Answer = document.querySelector('input[name="question3"]:checked');
    if (q3Answer && q3Answer.value === 'B') {
        score++;
    }

    // Question 4 Easy
    const q4Answer = document.querySelector('input[name="question4"]:checked');
    if (q4Answer && q4Answer.value === 'A') {
        score++;
    }

    // Question 5 Easy
    const q5Answer = document.querySelector('input[name="question5"]:checked');
    if (q5Answer && q5Answer.value === 'A') {
        score++;
    }

    // Question 6 Easy
    const q6Answer = document.querySelector('input[name="question6"]:checked');
    if (q6Answer && q6Answer.value === 'B') {
        score++;
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Display result
    alert('Your score is: ' + score + '/' + totalQuestions + ' (' + percentage + '%)');
});