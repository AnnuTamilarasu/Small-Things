const quotes = [
  "Every day is a new chance to heal.",
  "You’re stronger than you think.",
  "Small steps still move you forward.",
  "You don’t need to do everything — just do something.",
  "It’s okay to rest. Resting is part of progress.",
  "You matter more than you realize.",
  "Keep going. The future needs you.",
  "Your feelings are valid. Your story isn’t over."
];

const quoteText = document.getElementById("quote-text");

let index = 0;

function showQuote() {
    quoteText.style.opacity = 0;

    setTimeout(() => {
        quoteText.textContent = quotes[index];
        quoteText.style.animation = "none";
        void quoteText.offsetWidth; 
        quoteText.style.animation = "fade-in 1.5s forwards";
    }, 500);

    index = (index + 1) % quotes.length;
}

showQuote();
setInterval(showQuote, 6000); // new quote every 6 seconds
