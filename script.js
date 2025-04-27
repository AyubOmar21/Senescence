function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});

const text = document.getElementById('text');
const words = text.innerText.split(' '); // Split the text by spaces to wrap each word

// Clear current text and wrap each word in a span
text.innerHTML = '';
words.forEach(word => {
    const span = document.createElement('span');
    span.innerText = word;
    text.appendChild(span);
});

let score = 0;
let currentQuestionIndex = 0;

// Questions with options and correct answers (0 for the first option, 1 for the second)
const questions = [
    {
        question: "This is an art from Studio Ghibli. One is made by AI using their technique while the other is authentic. Which one is it?",
        options: ["images/ghibli fake.jpg", "images/ghibli real.jpg"],
        correctAnswer: 1, // Correct answer is the second option
    },
    {
        question: "These are football stadiums. One was taken by a fan during the game, while the other is made by AI. Guess!",
        options: ["images/stadium fake.jpg", "images/stadium real.jpg"],
        correctAnswer: 1, // Correct answer is the second option
    },
    {
        question: "A rainy day indeed! But one of them wasn't taken with a camera? I'm sure you can figure it out by now...",
        options: ["images/rain real.jpg", "images/rain ai.jpg"],
        correctAnswer: 0, // Correct answer is the first option
    },
    {
        question: "Nature is quite beautiful, as long as it actually NATURAL! Badum tss (I'll see myself out. You know what to do).",
        options: ["images/nature fake.jpg", "images/nature real.jpg"],
        correctAnswer: 1, // Correct answer is the second option
    }
];

// Function to update the score
function updateScore(isWrong = false) {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `${score}`;

    // Clear old animation classes
    scoreDisplay.classList.remove('score-jump', 'score-shake', 'score-wrong');
    void scoreDisplay.offsetWidth; // Force reflow

    if (isWrong) {
        // Wrong answer effect
        scoreDisplay.classList.add('score-shake', 'score-wrong');
    } else {
        // Normal correct jump
        scoreDisplay.classList.add('score-jump');
    }
}



// Function to show the current question and options
function showQuestion() {
    const question = questions[currentQuestionIndex];
    const questionTitle = document.getElementById("question-title");
    const options = document.querySelectorAll(".question-box");

    // Remove any icons left over
    options.forEach(option => removeIcons(option));

    // Display the question
    questionTitle.innerText = question.question;

    // Update the options
    options.forEach((option, index) => {
        const img = option.querySelector("img");
        img.src = question.options[index]; // Set the image for each option
        option.onclick = () => handleAnswerClick(option, index); // Attach click handler for each option
    });
    // 🆕 Trigger fade-in animation
    questionContainer.classList.remove('fade-in');
    void questionContainer.offsetWidth; // Force reflow (so animation can replay)
    questionContainer.classList.add('fade-in');

}

// Function to handle the answer click
function handleAnswerClick(option, selectedIndex) {
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll(".question-box");

    // Remove any previous icons and reset animation/border classes
    options.forEach(opt => {
        removeIcons(opt);
        opt.classList.remove('shake', 'float-up', 'correct-border', 'wrong-border');
    });

    // Add the icon (tick or X) to the selected option
    if (selectedIndex === question.correctAnswer) {
        addIcon(option, 'tick');
        option.classList.add('float-up', 'correct-border');
        updateScore(); // Correct answer = jump
        score += 1; // Increase score for correct answer
    } else {
        addIcon(option, 'x');
        option.classList.add('shake', 'wrong-border');
        updateScore(true); // Wrong answer = shake + red flash
    }

    updateScore(); // Update score display

    // Remove icons and classes a bit earlier than question switch
    setTimeout(() => {
        options.forEach(opt => {
            removeIcons(opt);
            opt.classList.remove('shake', 'float-up', 'correct-border', 'wrong-border');
        });
    }, 400); // matches your previous icon removal timing

    // Proceed to next question
    setTimeout(() => {
        currentQuestionIndex += 1;

        if (currentQuestionIndex < questions.length) {
            showQuestion(); // Show the next question
        } else {
            // ✨ ADD THIS ✨
            const finishedTitle = document.getElementById('finished-title');
            finishedTitle.style.display = 'block';
            finishedTitle.style.fontFamily = "'Pixelify Sans', sans-serif";
            finishedTitle.style.fontSize = '2.5rem'; // Bigger font size
            finishedTitle.style.textAlign = 'center'; // Optional, if you want it centered nicely
            finishedTitle.style.marginBottom = '20px'; // Space below the finished title
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-btn');
                retryBtn.style.display = 'block'; // Show the retry button
            }, 1000);
            launchConfetti(); // Make sure this is called
            
        }
    }, 400); // Wait for animation to finish before moving to the next question
}


// Function to add the correct icon (tick or X) to the selected answer with drawing animation
function addIcon(option, type) {
    const icon = document.createElement('div');
    icon.classList.add('icon');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'white');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    if (type === 'tick') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20 6L9 17l-5-5');
        path.classList.add('draw-path'); // Add animation class
        svg.appendChild(path);
    } else if (type === 'x') {
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M18 6L6 18');
        path2.setAttribute('d', 'M6 6l12 12');
        path1.classList.add('draw-path');
        path2.classList.add('draw-path');
        svg.appendChild(path1);
        svg.appendChild(path2);
    }

    icon.appendChild(svg);
    option.appendChild(icon);

    // Trigger the drawing animation
    setTimeout(() => {
        icon.classList.add('draw'); // This will trigger the stroke-dashoffset animation
    }, 100); // Small delay to make sure the icon is added before animating
}

// Function to remove any existing icons (for the next question)
function removeIcons(option) {
    const icons = option.querySelectorAll('.icon');
    icons.forEach(icon => icon.remove());
}

document.getElementById('retry-btn').addEventListener('click', () => {
    score = 0;
    currentQuestionIndex = 0;
    updateScore();
    showQuestion();

    // Hide retry button again
    document.getElementById('retry-btn').style.display = 'none';
});

function launchConfetti() {
    const duration = 3 * 1000; // 3 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0, 1), y: Math.random() * 0.4 }
        }));
    }, 250);
}




// Initialize the game
showQuestion();





