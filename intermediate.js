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

    // Array to store incorrect answers for feedback
    let feedback = [];

    // Question 1 Intermediate (Text Input)
    const answer1 = document.getElementById('question1text').value.trim();
    if (answer1 === correctAnswers['question1text']) {
        score++;
    } else {
        feedback.push({
            question: "Question 1",
            selected: answer1,
            correct: correctAnswers['question1text']
        });
    }

    // Question 2 Intermediate (Radio Button)
    const q2Answer = document.querySelector('input[name="question2intermediate"]:checked');
    if (q2Answer && q2Answer.value === correctAnswers['question2intermediate']) {
        score++;
    } else {
        feedback.push({
            question: "Question 2",
            selected: q2Answer ? q2Answer.value : 'No answer selected',
            correct: correctAnswers['question2intermediate']
        });
    }

    // Question 3 Intermediate (Radio Button)
    const q3Answer = document.querySelector('input[name="question3intermediate"]:checked');
    if (q3Answer && q3Answer.value === correctAnswers['question3intermediate']) {
        score++;
    } else {
        feedback.push({
            question: "Question 3",
            selected: q3Answer ? q3Answer.value : 'No answer selected',
            correct: correctAnswers['question3intermediate']
        });
    }

    // Question 4 Intermediate (Radio Button)
    const q4Answer = document.querySelector('input[name="question4intermediate"]:checked');
    if (q4Answer && q4Answer.value === correctAnswers['question4intermediate']) {
        score++;
    } else {
        feedback.push({
            question: "Question 4",
            selected: q4Answer ? q4Answer.value : 'No answer selected',
            correct: correctAnswers['question4intermediate']
        });
    }

    // Question 5 Intermediate (Radio Button)
    const q5Answer = document.querySelector('input[name="question5intermediate"]:checked');
    if (q5Answer && q5Answer.value === correctAnswers['question5intermediate']) {
        score++;
    } else {
        feedback.push({
            question: "Question 5",
            selected: q5Answer ? q5Answer.value : 'No answer selected',
            correct: correctAnswers['question5intermediate']
        });
    }

    // Question 6 Intermediate (Radio Button)
    const q6Answer = document.querySelector('input[name="question6intermediate"]:checked');
    if (q6Answer && q6Answer.value === correctAnswers['question6intermediate']) {
        score++;
    } else {
        feedback.push({
            question: "Question 6",
            selected: q6Answer ? q6Answer.value : 'No answer selected',
            correct: correctAnswers['question6intermediate']
        });
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Display score and feedback
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
