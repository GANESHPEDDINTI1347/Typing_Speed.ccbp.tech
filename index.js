const testParagraphElement = document.getElementById('testParagraph');
const userInputElement = document.getElementById('userInput');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');

const quotes = [
    "When a poor fisherman discovers a priceless gold ring inside a fish, he can’t believe his luck. He takes the ring to the king and is richly rewarded. His nosy neighbour – greedy to get rich himself – tries to find out how the fisherman came by his wealth and spies on him. But the neighbour is partially deaf. And when he tries to replicate the fisherman’s success based on what he thinks he’s overheard, things don’t quite turn out as he’d hoped.",
    "A thief attempting to rob an old woman hears her muttering about the Horrible Dib Dib. ‘This abominable Dib Dib will be the death of me,’ she cries. Gripped with paranoia, the thief slinks home in chills, setting off a chain of events that ultimately reveals what exactly this horrible, abominable Dib Dib is, that is worrying the life out of so many people. A wonderful tale that reminds the reader how powerful human thoughts can be, even when they’re misguided.",
    "The Rich Man and the Monkey by Idries Shah When a monkey meets a rich man, he complains that he is poor. ‘I own nothing, not even clothes,’ the monkey says. The rich man, who has a big house and vast estates, starts to feel guilty about possessing so much while the monkey remains destitute. So he decides to sign over all his possessions to the animal. Is this a wise choice? Or has the rich man been too hasty in giving everything away to a monkey?",
    "I sometimes wish that we would have some nicer food and different kinds of things to eat,’ a wood-cutter’s daughter tells her father one evening. Her simple request sparks a fantastical chain of events that sees the lives of the woodcutter and his daughter improved by the mysterious ‘Mushkil Gusha’, the Remover of Difficulties. On the following Thursday night, however, the wood-cutter and his daughter both forget to commemorate Mushkil Gusha – and their lives take another dramatic and unexpected turn, changing forever…",
    "We all fear change and yet change is the very essence of life. How does a stream cross the mighty, desolate desert? Can it allow itself to change its very form to survive the journey? The Tale of the Sands helps the reader absorb the lesson that change can transform us, if only we have the courage to embrace it.",
    "Because she fails to follow the precise instructions given to her by Arif the Wise Man, The Queen of Hich-Hich gives birth to a half-boy. That Neem is able to make himself complete by an act of cleverness, negotiation and compromise teaches children more than the expected, usual lesson of bravery.",
    "Stubbornness is a human quality that can both serve and undermine. In this story, a newly married couple, glowing from their lavish nuptials, nonetheless fall victim to their own stubbornness. So determined are they not to give in, that they manage to lose everything, including one another.",
    "In this amusing story, an old woman encounters an eagle for the first time. Perplexed by its unfamiliar appearance, she decides to change it to suit her own ideas of what a bird should look like. Her efforts mirror a common pattern of human thought: altering the unfamiliar to make it acceptable."
];

let currentQuote = '';
let startTime = 0;
let timerInterval;
let testActive = false;
let typedCharactersCount = 0;
let correctCharactersCount = 0;

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function renderQuote() {
    currentQuote = getRandomQuote();
    testParagraphElement.innerHTML = '';
    currentQuote.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        testParagraphElement.appendChild(span);
    });
}

function resetTest() {
    clearInterval(timerInterval);
    testActive = false;
    startTime = 0;
    typedCharactersCount = 0;
    correctCharactersCount = 0;

    userInputElement.value = '';
    userInputElement.disabled = true;
    userInputElement.classList.remove('finished');

    startButton.disabled = false;
    resetButton.disabled = true;

    timerElement.textContent = '0s';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '0%';

    renderQuote();
}

function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
        timerElement.textContent = `${elapsedTime}s`;
    }, 1000);
}
userInputElement.addEventListener('input', () => {
    if (!testActive) {
        testActive = true;
        startTimer();
        startButton.disabled = true;
        resetButton.disabled = false;
    }

    const typedText = userInputElement.value;
    const quoteChars = testParagraphElement.querySelectorAll('span');
    typedCharactersCount = typedText.length;
    correctCharactersCount = 0;
    let errors = 0;

    quoteChars.forEach((charSpan, index) => {
        const charInQuote = currentQuote[index];
        const charTyped = typedText[index];

        // Clear previous classes
        charSpan.classList.remove('correct', 'incorrect', 'current');

        if (charTyped == null) {
            if (index === typedText.length) {
                charSpan.classList.add('current');
            }
        } else if (charTyped === charInQuote) {

            charSpan.classList.add('correct');
            correctCharactersCount++;
        } else {

            charSpan.classList.add('incorrect');
            errors++;
        }
    });
    if (typedText.length > currentQuote.length) {
        errors += (typedText.length - currentQuote.length);
    }

    const elapsedTimeInMinutes = (new Date().getTime() - startTime) / 1000 / 60;
    const wordsPerMinute = elapsedTimeInMinutes > 0 ? Math.round((correctCharactersCount / 5) / elapsedTimeInMinutes) : 0;
    const accuracy = typedCharactersCount > 0 ? Math.round(((typedCharactersCount - errors) / typedCharactersCount) * 100) : 0; // Corrected accuracy calculation

    wpmElement.textContent = wordsPerMinute;
    accuracyElement.textContent = `${accuracy}%`;

    if (typedText.length === currentQuote.length) {
        let allCorrect = true;
        for (let i = 0; i < currentQuote.length; i++) {
            if (typedText[i] !== currentQuote[i]) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            endTest();
        }
    }
});

function endTest() {
    clearInterval(timerInterval);
    testActive = false;
    userInputElement.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = false;
}
startButton.addEventListener('click', () => {
    resetTest();
    userInputElement.disabled = false;
    userInputElement.focus();
});

resetButton.addEventListener('click', resetTest);
document.addEventListener('DOMContentLoaded', renderQuote);
