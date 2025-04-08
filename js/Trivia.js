import { fetchPokemon } from "./api.js";

const triviaContainer = document.querySelector(".trivia-container");
const startButtons = document.querySelectorAll(".start-btn");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const feedbackEl = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score-display");
const questionNumberEl = document.getElementById("question-number");
const resultBox = document.getElementById("result-box");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let questions = [];
let allQuestions = [];
let currentQuestion = 0;
let score = 0;
let quizComplete = false;
let hasAnswered = false;

fetch("json/trivia.json").then(res => res.json()).then(data => {
    allQuestions = data;
});

function loadQuestion() {
    feedbackEl.textContent = "";
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
    optionsList.innerHTML = "";
    resultBox.classList.add("hidden");
    hasAnswered = false;

    optionsList.classList.remove("image-layout");

    const q = questions[currentQuestion];
    questionText.textContent = q.question;
    questionNumberEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    scoreDisplay.textContent = `Score: ${score}`;

    if (q.type === "multiple") {
        q.options.forEach(option => {
            const li = document.createElement("li");
            li.textContent = option;
            li.classList.add("option");
            li.addEventListener("click", () => handleAnswer(option, q.answer, li));
            optionsList.appendChild(li);
        });
    }

    if (q.type === "image-true-false") {
        optionsList.classList.add("image-layout");

        q.images.forEach(async (pokemon) => {
            const li = document.createElement("li");
            li.classList.add("option", "image-option");
            
            const data = await fetchPokemon(pokemon.name);
            if (data) {
                const image = document.createElement("img");
                image.src = data.sprites.other["official-artwork"].front_default;
                image.alt = "Pokémon";
        
                li.appendChild(image);
                li.addEventListener("click", () => handleAnswer(
                    pokemon.name.toLowerCase(), q.answer.toLowerCase(), li
                ));
                optionsList.appendChild(li);
            } else {
                console.error(`Image of ${pokemon.name} can't be loaded.`);
            }
        });
    }

    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'Finish';
    } else {
        nextBtn.textContent = 'Next';
    };
}

function handleAnswer(selected, correct, element) {
    if (hasAnswered) return;
    hasAnswered = true;

    const options = document.querySelectorAll(".option");
  
    options.forEach(opt => opt.classList.add("disabled"));
  
    if (selected === correct) {
        element.classList.add("correct");
        feedbackEl.textContent = "Correct!";
        score++;
    } else {
        element.classList.add("wrong");
        feedbackEl.textContent = `Wrong! The correct answer was: ${correct}`;
        const correctOption = [...options].find(opt =>
            opt.textContent.includes(correct) || opt.querySelector("p")?.textContent === correct
        );
        if (correctOption) correctOption.classList.add("correct");
    }
  
    scoreDisplay.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

startButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const count = parseInt(btn.dataset.count);
        questions = shuffleArray([...allQuestions]).slice(0, count);
        currentQuestion = 0;
        score = 0;
        quizComplete = false;
        resultBox.classList.add("hidden");
        document.querySelector(".quiz-start").classList.add("hidden");
        triviaContainer.classList.remove("hidden");
        loadQuestion();
    });
});

nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        endQuiz();
    } else {
        loadQuestion();
    }
});

restartBtn.addEventListener("click", () => {
    resultBox.classList.add("hidden");
    triviaContainer.classList.add("hidden");
    document.querySelector(".quiz-start").classList.remove("hidden");
    currentQuestion = 0;
    score = 0;
    quizComplete = false;
    localStorage.removeItem("lastTriviaScore");
    loadQuestion();
});

function endQuiz() {
    quizComplete = true;
    finalScoreEl.textContent = `You scored ${score} out of ${questions.length}!`;
    resultBox.classList.remove("hidden");
    
    // Local Storage
    localStorage.setItem("lastTriviaScore", score);
}