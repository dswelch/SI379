import {Howl} from 'howler';

const CHOMP_SOUND = 'sounds/chomp.mp3'
const HIGH_SCORE_SOUND = 'sounds/high_score.mp3'
const LOSE_SOUND = 'sounds/lose.mp3'

const MOVE_DISTANCE = 20;
const TICK_TIME = 150;
let currentDirection;
let moveInterval;
let currentScore = 0;
let newHighScore = false;

const svgElement = document.querySelector('svg');
const snakeHead = document.querySelector('#snake-head');
const food = document.querySelector('#food');
const highScoreElem = document.querySelector('#high-score');
const currentScoreElem = document.querySelector('#current-score');

let highScore;
try {
    highScore = JSON.parse(parseInt(localStorage.getItem("highScore")) || 0);
}
catch (e){
    console.log(e);
    highScore = 0;
}
highScoreElem.innerText = `Your high score: ${highScore}`;

let snakeMoving = false;
let lost = false;
let snakeX = parseInt(snakeHead.getAttribute('x'));
let snakeY = parseInt(snakeHead.getAttribute('y'));
let locationArray = [[snakeX, snakeY]];
let foodLocation = [food.getAttribute('x'), food.getAttribute('y')];
let snakeTailArray = [snakeHead];
let occupiedBlocks = new Set([`${snakeX},${snakeY}`]);

function yOut(y){
    // hardcoded, assuming border will not move
    const yLow = 0;
    const yHigh = 360;
    if (y <= yLow || y >= yHigh){
        return true;
    }
    return false;
}

function xOut(x){
    // hardcoded, assuming border will not move
    const xLow = 0;
    const xHigh = 500;
    if (x <= xLow || x >= xHigh){
        return true;
    }
    return false;
}

function getFoodLocation(xMax, yMax){
    function isEqual(element, [tempX, tempY]){
        if(element[0] !== tempX || element[1] !== tempY || element.length !== 2){
            return false;
        }
        return true;
    }
    const xVal = Math.floor(Math.random() * xMax);
    const yVal = Math.floor(Math.random() * yMax);
    while(occupiedBlocks.has((`${xVal},${yVal}`))){
        xVal = Math.floor(Math.random() * xMax);
        yVal = Math.floor(Math.random() * yMax);
    }
    return [xVal, yVal];
}

function onFood(){
    if ((Math.abs(snakeX - foodLocation[0]) < 15) && (Math.abs(snakeY - foodLocation[1]) < 15)){
        return true;
    }
    return false;
}

function moveFood(){
    // grid is 25 x 18
    const xMax = 24;
    const yMax = 17;
    let [xVal, yVal] = getFoodLocation(xMax, yMax);
    xVal += 1;
    yVal += 1;
    xVal *= 20;
    yVal *= 20;
    food.setAttribute('x', xVal);
    food.setAttribute('y', yVal);
    foodLocation = [xVal, yVal];
}

function updateScore(){
    currentScoreElem.innerText = `Your current score: ${currentScore}`;
    if (currentScore > highScore){
        newHighScore = true;
        highScore = currentScore;
        highScoreElem.innerText = `Your high score: ${highScore}`;
        localStorage.setItem("highScore", JSON.stringify(highScore));
    }
}

function eatFood(){
    var sound = new Howl({
        src: [CHOMP_SOUND]
    });
    sound.play();
    // grab current end of tail
    const [xEnd, yEnd] = locationArray[locationArray.length-1];
    // wait a tick before creating new block
    setTimeout(() => {
        // create new block
        var svgns = "http://www.w3.org/2000/svg";
        var new_rect = document.createElementNS(svgns, "rect");
        // set location to last part of tail
        new_rect.setAttributeNS(null, 'x', xEnd);
        new_rect.setAttributeNS(null, 'y', yEnd);
        new_rect.setAttributeNS(null, 'width', '20px');
        new_rect.setAttributeNS(null, 'height', '20px');
        new_rect.setAttributeNS(null, 'fill', 'green');
        svgElement.appendChild(new_rect);
        locationArray.push([xEnd, yEnd]);
        snakeTailArray.push(new_rect);
    }, TICK_TIME);
    currentScore++;
    updateScore(currentScore);
    moveFood();
}

// needs locationArray in state before head movement
function moveTail(){
    const xToDelete = locationArray[locationArray.length-1][0];
    const yToDelete = locationArray[locationArray.length-1][1];
    occupiedBlocks.delete(`${xToDelete},${yToDelete}`);
    for (let i=locationArray.length-1; i>0;i--){
        const newX = locationArray[i-1][0];
        const newY = locationArray[i-1][1];
        snakeTailArray[i].setAttribute('x', newX);
        snakeTailArray[i].setAttribute('y', newY);
        locationArray[i] = [newX, newY];
    }
}

function moveSnake(){
    if (currentDirection === 'l'){
        snakeX = snakeX - MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        if (occupiedBlocks.has(`${snakeX},${snakeY}`)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('x', snakeX);
        moveTail();
        locationArray[0][0] = snakeX;
        occupiedBlocks.add(`${snakeX},${snakeY}`);
    }
    else if (currentDirection === 'r'){
        snakeX = snakeX + MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        if (occupiedBlocks.has(`${snakeX},${snakeY}`)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('x', snakeX);
        moveTail();
        locationArray[0][0] = snakeX;
        occupiedBlocks.add(`${snakeX},${snakeY}`);
    }
    else if (currentDirection === 'u'){
        snakeY = snakeY - MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        if (occupiedBlocks.has(`${snakeX},${snakeY}`)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('y', snakeY);
        moveTail();
        locationArray[0][1] = snakeY;
        occupiedBlocks.add(`${snakeX},${snakeY}`);
    }
    else if (currentDirection === 'd'){
        snakeY = snakeY + MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        // function logSetElements(value1) {
        //     console.log(value1);
        // }
        // occupiedBlocks.forEach(logSetElements);
        if (occupiedBlocks.has(`${snakeX},${snakeY}`)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('y', snakeY);
        moveTail();
        locationArray[0][1] = snakeY;
        occupiedBlocks.add(`${snakeX},${snakeY}`);
    }
}

function snakeGo () {
    if(!snakeMoving){
        currentDirection = undefined;
        snakeMoving = true;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveSnake, TICK_TIME);
        moveSnake();
    }
}

function handleKeyDown(event) {
    if (!lost){
        // if they hit right
        if (event.key === "ArrowRight"){
            snakeGo();
            // if we're not already going left
            if(currentDirection !== 'l'){
                // turn right
                currentDirection = 'r';
            }
        }
        else if(event.key === "ArrowLeft"){
            snakeGo();
            // not already going right
            if(currentDirection !== 'r'){
                // go left
                currentDirection = 'l';
            }
        }
        else if(event.key === "ArrowDown"){
            snakeGo();
            // not already going up
            if(currentDirection !== 'u'){
                // go down
                currentDirection = 'd';
            }
        }
        else if(event.key === "ArrowUp"){
            snakeGo();
            // not already going down
            if(currentDirection !== 'd'){
                // go up
                currentDirection = 'u';
            }
        }
    }
}

function loseScreen(){
    if (!lost){
        var sound = new Howl({
            src: [LOSE_SOUND]
        });
        sound.play();

        lost = true;
        svgElement.remove();
        clearInterval(moveInterval);
        // reset snakeHead
        snakeMoving = false;
        snakeX = 40;
        snakeHead.setAttribute('x', snakeX);
        snakeY = 50;
        snakeHead.setAttribute('y', snakeY);
        
        // reset tail
        for (let i=1;i<snakeTailArray.length;i++){
            snakeTailArray[i].remove();
        }
        snakeTailArray = [snakeHead];
        locationArray = [[snakeX, snakeY]];

        // reset occupiedBlocks
        occupiedBlocks = new Set([`${snakeX},${snakeY}`]);

        // reset food
        foodLocation = [112.5, 52.5];
        food.setAttribute('x', foodLocation[0]);
        food.setAttribute('y', foodLocation[1]);

        // reset scores
        currentScoreElem.innerText = `This run's score: ${currentScore}`;
        currentScore = 0;

        // check for new high score
        let newHighScoreElem;
        if (newHighScore){
            sound.on('end', function(){
                var sound = new Howl({
                    src: [HIGH_SCORE_SOUND]
                });
                sound.play();
              });
            newHighScoreElem = document.createElement("div");
            newHighScoreElem.innerText = "New high score!";
            document.body.append(newHighScoreElem);
        }

        // put in restart button
        const restartButton = document.createElement("button");
        restartButton.innerText = "Restart game?";
        document.body.append(restartButton);
        restartButton.addEventListener("click", () => {
            if (newHighScore){
                newHighScore = false;
                newHighScoreElem.remove();
            }
            lost = false;
            document.body.append(svgElement);
            currentScoreElem.innerText = `Your current score: ${currentScore}`;
            document.body.append(highScoreElem);
            document.body.append(currentScoreElem);
            restartButton.remove();
        });
    }
}

updateScore();
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
window.addEventListener('keydown', handleKeyDown);