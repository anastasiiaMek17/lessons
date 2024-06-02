const questions = [
    {
        question: "Ви в віковій категорії від 18 до 24 років?",
        options: [
            { text: "Так", next: 1 },
            { text: "Ні", next: -1 }
        ]
    },
    {
        question: "Ви обираєте професію?",
        options: [
            { text: "Так", result: "Виберіть професію" },
            { text: "Ні", next: 2 }
        ]
    },
    {
        question: "Ви готуєтеся до вступу в коледж або інститут?",
        options: [
            { text: "Так", result: "Підготуйтеся до вступу в коледж або інститут" },
            { text: "Ні", next: 3 }
        ]
    },
    {
        question: "Ви вступили до коледжу або інституту?",
        options: [
            { text: "Так", result: "Вступіть до коледжу або інституту" },
            { text: "Ні", next: 4 }
        ]
    },
    {
        question: "Ви плануєте майбутнє?",
        options: [
            { text: "Так", next: 5 },
            { text: "Ні", result: "Завершено" }
        ]
    },
    {
        question: "Ваш сімейний стан?",
        options: [
            { text: "Самотня людина", next: 6 },
            { text: "Сім'я без дітей", next: 10 },
            { text: "Сім'я з дітьми", next: 14 }
        ]
    },
    // Самотня людина
    {
        question: "Ви хочете розробити план заощаджень на особисті потреби?",
        options: [
            { text: "Так", result: "Розробіть план заощаджень грошей на особисті потреби" },
            { text: "Ні", next: 7 }
        ]
    },
    {
        question: "Ви хочете визначити суму кредиту?",
        options: [
            { text: "Так", result: "Визначте суму кредиту" },
            { text: "Ні", next: 8 }
        ]
    },
    {
        question: "Ви хочете розробити систему ведення фінансових документів?",
        options: [
            { text: "Так", result: "Розробіть систему ведення фінансових документів" },
            { text: "Ні", result: "Завершено" }
        ]
    },
    // Сім'я без дітей
    {
        question: "Ви хочете виробити план економії грошей для сумісних цілей?",
        options: [
            { text: "Так", result: "Виробіть план економії грошей для сумісних цілей" },
            { text: "Ні", next: 11 }
        ]
    },
    {
        question: "Ви хочете визначити суму кредиту?",
        options: [
            { text: "Так", result: "Визначте суму кредиту" },
            { text: "Ні", next: 12 }
        ]
    },
    {
        question: "Ви хочете розробити систему ведення фінансових документів?",
        options: [
            { text: "Так", result: "Розробіть систему ведення фінансових документів" },
            { text: "Ні", next: 13 }
        ]
    },
    {
        question: "Ви хочете планувати житлові умови?",
        options: [
            { text: "Так", result: "Плануйте житлові умови" },
            { text: "Ні", result: "Завершено" }
        ]
    },
    // Сім'я з дітьми
    {
        question: "Ви хочете виробити план економії грошей з урахуванням потреб дітей?",
        options: [
            { text: "Так", result: "Виробіть план економії грошей з урахуванням потреб дітей" },
            { text: "Ні", next: 15 }
        ]
    },
    {
        question: "Ви хочете визначити суму кредиту для внесків в майбутньому?",
        options: [
            { text: "Так", result: "Визначте суму кредиту для внесків в майбутньому" },
            { text: "Ні", next: 16 }
        ]
    },
    {
        question: "Ви хочете розробити систему ведення фінансових документів?",
        options: [
            { text: "Так", result: "Розробіть систему ведення фінансових документів" },
            { text: "Ні", next: 17 }
        ]
    },
    {
        question: "Ви хочете планувати житлові умови?",
        options: [
            { text: "Так", result: "Плануйте житлові умови" },
            { text: "Ні", result: "Завершено" }
        ]
    }
];

let currentQuestionIndex = 0;

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = "";

    const currentQuestion = questions[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.textContent = currentQuestion.question;
    questionContainer.appendChild(questionElement);

    currentQuestion.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="option" value="${index}"> ${option.text}`;
        questionContainer.appendChild(label);
    });
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const selectedValue = parseInt(selectedOption.value);
        const currentQuestion = questions[currentQuestionIndex];
        const next = currentQuestion.options[selectedValue].next;

        if (next !== undefined && next !== null) {
            currentQuestionIndex = next;
            loadQuestion();
        } else {
            const result = currentQuestion.options[selectedValue].result;
            document.getElementById("question-container").innerHTML = `<div class="result">${result}</div>`;
            document.getElementById("next-button").style.display = "none";
        }
    } else {
        alert("Будь ласка, виберіть варіант відповіді.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
});
