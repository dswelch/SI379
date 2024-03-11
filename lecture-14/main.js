const timeDisplay = document.querySelector('#time-display'); // Displays the time
const startButton = document.querySelector('#start-button'); // Starts the timer
const pauseButton = document.querySelector('#pause-button'); // Pauses the timer
const resetButton = document.querySelector('#reset-button'); // Resets the timer

/**
 * Update the content in the #time-display element to reflect the current time
 * @param {*} value Time in milliseconds
 */
function updateDisplay(value) {
    timeDisplay.innerText = (value/1000).toFixed(2);
}

startTime = Date.now();
pauseTime = 0;
updateDisplay(0);

startButton.addEventListener("click", () => {
    startTime = Date.now();
    const timerInterval = setInterval(setTimer, 10);
    startButton.setAttribute("disabled", true);
    pauseTime = 0;
});

function setTimer(){
    updateDisplay(Date.now() - startTime);
}

pauseButton.addEventListener("click", () => {
    pauseTime
});