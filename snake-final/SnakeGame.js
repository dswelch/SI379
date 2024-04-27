const MOVE_DISTANCE = 10;
let currentDirection;
let moveInterval;

const svgElement = document.querySelector('svg');
const snakeHead = document.querySelector('#snake-head');
const food = document.querySelector('#food');

let snakeMoving = false;
let lost = false;
let snakeX = parseInt(snakeHead.getAttribute('x'));
let snakeY = parseInt(snakeHead.getAttribute('y'));
let locationArray = [[snakeX, snakeY]];

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
    while(locationArray.find(element => isEqual(element, [xVal, yVal]))){
        xVal = Math.floor(Math.random() * xMax);
        console.log(xVal);
        yVal = Math.floor(Math.random() * yMax);
        console.log(yVal);
    }
    return [xVal, yVal];
}

function placeFood(){
    // grid is 25 x 18
    const xMax = 24;
    const yMax = 17;
    const [xVal, yVal] = getFoodLocation(xMax, yMax);
    console.log(xVal, yVal);
}

function moveSnake(){
    if (currentDirection === 'l'){
        snakeX = snakeX - MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        snakeHead.setAttribute('x', snakeX);
        locationArray[0][0] = snakeX;
    }
    else if (currentDirection === 'r'){
        snakeX = snakeX + MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        snakeHead.setAttribute('x', snakeX);
        locationArray[0][0] = snakeX;
    }
    else if (currentDirection === 'u'){
        snakeY = snakeY - MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        snakeHead.setAttribute('y', snakeY);
        locationArray[0][1] = snakeY;
    }
    else if (currentDirection === 'd'){
        snakeY = snakeY + MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        snakeHead.setAttribute('y', snakeY);
        locationArray[0][1] = snakeY;
    }
}

function snakeGo () {
    if(!snakeMoving){
        currentDirection = undefined;
        snakeMoving = true;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveSnake, 100);
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
window.addEventListener('keydown', handleKeyDown);
placeFood();

function loseScreen(){
    lost = true;
    svgElement.remove();
    clearInterval(moveInterval);
    // reset snakeHead
    snakeMoving = false;
    snakeX = 40;
    snakeHead.setAttribute('x', snakeX);
    snakeY = 50;
    snakeHead.setAttribute('y', snakeY);
    locationArray = [[snakeX, snakeY]];
    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart game?";
    document.body.append(restartButton);
    restartButton.addEventListener("click", () => {
        lost = false;
        document.body.append(svgElement);
        restartButton.remove();
    });
}
