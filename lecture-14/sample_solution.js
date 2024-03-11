const timeDisplay = document.querySelector('#time-display'); // Displays the time
const startButton = document.querySelector('#start-button'); // Starts the timer
const pauseButton = document.querySelector('#pause-button'); // Pauses the timer
const resetButton = document.querySelector('#reset-button'); // Resets the timer

let elapsedTime = 0; // Time that has elapsed since the last time we paused the timer
let startedTime; // Timestamp when we started the timer
let updateInterval; // ID of the interval that updates the time display

/**
 * Update the content in the #time-display element to reflect the current time
 * @param {*} value Time in milliseconds
 */
function updateDisplay(value) {
    timeDisplay.innerText = (value/1000).toFixed(2);
}


function updateTime() {
    const currentRunTime = Date.now() - startedTime; // Time since we last clicked "start"
    const totalTime = elapsedTime + currentRunTime; // Time since clicking "start" plus the time elapsed since the last time we clicked "pause"
    updateDisplay(totalTime); // Update the DOM to reflect this time
}

function startTimer() {
    startButton.setAttribute('disabled', 'true'); // Disable the start button
    pauseButton.removeAttribute('disabled'); // Enable the pause button
    startedTime = Date.now(); // Track when we clicked "start"
    updateInterval = setInterval(updateTime, 10); // Update the time display frequently
    updateTime(); // ...and immediately
}

function stopTimer() {
    pauseButton.setAttribute('disabled', 'true'); // Disable the pause button
    startButton.removeAttribute('disabled'); // Enable the start button
    clearInterval(updateInterval); // Stop updating the time display
}

function pauseTimer() {
    stopTimer(); // Stop the timer
    elapsedTime += Date.now() - startedTime; // Track how much time has elapsed since we last clicked "start"
    updateDisplay(elapsedTime);
}

function resetTimer() {
    stopTimer(); // Stop the timer
    elapsedTime = 0; // Reset the elapsed time
    updateDisplay(0); // Reset the time display
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

resetTimer();