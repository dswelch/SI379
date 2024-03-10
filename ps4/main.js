/**
 * Cache a fetch() request in localStorage and return the cached data if it's not expired.
 * Useful if you are doing live editing refreshes and don't want to query the API every time.
 * 
 * @param {string} url The URL to fetch
 * @param {*} options The options to pass to fetch()
 * @param {number} cacheDuration The maximum age to use for cached data, in milliseconds
 * @returns A Promise that resolves to a Response object
 */
function fetchWithCache(url, options = {}, cacheDuration = 1000 * 60 * 60) { // Default cache duration is 1 hour
    // Utility function to create a Response object from data (like fetch() would)
    function getResponseObject(data) {
        return new Response(new Blob([JSON.stringify(data)]));
    }

    const cachedData = localStorage.getItem(url); // Check if we have cached data for this URL

    if (cachedData) { // If we do...
        const { timestamp, data } = JSON.parse(cachedData); // Parse the data from the cache
        // Note: This uses destructuring syntax. It's equivalent to:
        // const parsedCachedData = JSON.parse(cachedData);
        // const timestamp = parsedCachedData.timestamp;
        // const data = parsedCachedData.data;

        if (Date.now() - timestamp < cacheDuration) { //...and it's not expired,
            return Promise.resolve(getResponseObject(data)); // Return a promise whose value is the stored data
        } else { // it has expired, so remove it
            localStorage.removeItem(url);
        }
    }

    // If we don't have cached data or it's expired, fetch it from the network
    return fetch(url, options)
        .then((response) => response.json()) // Parse the JSON data from the response
        .then((data) => {
            localStorage.setItem(url, JSON.stringify({ // Store the data in localStorage with a timestamp
                timestamp: Date.now(),
                data
            }));
            return getResponseObject(data);
        });
}

/**
 * A function to randomly shuffle the items in an array and return a copy of the shuffled array.
 * Based on: https://stackoverflow.com/a/12646864
 * 
 * @param {Array} array An array of any type
 * @returns A shuffled copy of the array
 */
function shuffleArray(array) {
    const shuffledArray = array.slice(); // Copy the array

    // Shuffle the copy of the array using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) { // For each index,
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements i and j
    }
    return shuffledArray; // Return the shuffled copy
}

fetch("https://the-trivia-api.com/v2/questions").then((response) => response.json() )
.then((value) => {
    const questions = value;
    let score = 0;
    let attempted = 0;

    const scoreElem = document.createElement("div");
    scoreElem.innerText = "Score: 0/0";
    scoreElem.setAttribute("id", "score");
    document.body.append(scoreElem);

    function updateScore(correct){
        if (correct){
            score++;
        }
        attempted++;
        const tempScoreElem = document.querySelector("#score");
        tempScoreElem.innerText = `Score: ${score}/${attempted}`;
    }

    function select(question){
        const correct = question.getAttribute("correct");
        for(let i=0;i<question.children.length;i++){
            if(question.children[i].innerText === correct){
                question.children[i].classList.add("green");
            }
            else{
                question.children[i].classList.add("red");
            }
            question.children[i].setAttribute("disabled", true);
        }
    }

    function selectCorrect(index){
        const question = document.querySelector(`#question${index}`);
        select(question);
        const questionText = document.querySelector(`#questionText${index}`);
        const curText = questionText.innerText;
        questionText.innerText = curText + " CORRECT!";
        questionText.classList.add("greenText");
        updateScore(true);
    }
    
    function selectWrong(index){
        const question = document.querySelector(`#question${index}`);
        select(question);
        const questionText = document.querySelector(`#questionText${index}`);
        const curText = questionText.innerText;
        questionText.innerText = curText + " INCORRECT!";
        questionText.classList.add("redText");
        updateScore(false);
    }

    for (let i=0; i<questions.length;i++){
        const question = questions[i];
        const questionTextElem = document.createElement("div");
        questionTextElem.innerText = question.question.text;
        questionTextElem.setAttribute("id", `questionText${i}`);
        document.body.append(questionTextElem);
        const correctAnswer = question.correctAnswer;
        let answers = [];
        answers.push(correctAnswer);
        // answer list elem will contain all the answers possible
        const answerListElem = document.createElement("ul");
        answerListElem.setAttribute("id", `question${i}`);
        // add the incorrect answers to the array, then shuffle
        for (let j=0;j<question.incorrectAnswers.length;j++){
            answers.push(question.incorrectAnswers[j]);
        }
        answers = shuffleArray(answers);
        // add to the document
        for (let j=0;j<answers.length;j++){
            // correct
            if(answers[j] === correctAnswer){
                const correctButtonElem = document.createElement("button");
                correctButtonElem.innerText = answers[j];
                correctButtonElem.addEventListener("click", () => {
                    selectCorrect(i);
                });
                answerListElem.setAttribute("correct", correctAnswer);
                answerListElem.append(correctButtonElem);
            }
            else{
                const incorrectButtonElem = document.createElement("button");
                incorrectButtonElem.innerText = answers[j];
                incorrectButtonElem.addEventListener("click", () => {
                    selectWrong(i);
                });
                answerListElem.append(incorrectButtonElem);
            }
            // incorrect
        }
        document.body.append(answerListElem);
    }
});
