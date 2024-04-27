const MOVE_DISTANCE = 10;
let currentDirection;
let moveInterval;
const locationArray = [];

const svgElement = document.querySelector('svg');
const snakeHead = document.querySelector('#snake-head');

let snakeMoving = false;
let snakeX = parseInt(snakeHead.getAttribute('x'));
let snakeY = parseInt(snakeHead.getAttribute('y'));

function yOut(y){
    // hardcoded, assuming border will not move
    const yLow = 0;
    const yHigh = 350;
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

function moveSnake(){
    if (currentDirection === 'l'){
        snakeX = snakeX - MOVE_DISTANCE;
        if (xOut(snakeX)){
            console.log("lose");
        }
        snakeHead.setAttribute('x', snakeX);
    }
    else if (currentDirection === 'r'){
        snakeX = snakeX + MOVE_DISTANCE;
        if (xOut(snakeX)){
            console.log("lose");
        }
        snakeHead.setAttribute('x', snakeX);
    }
    else if (currentDirection === 'u'){
        snakeY = snakeY - MOVE_DISTANCE;
        if (yOut(snakeY)){
            console.log("lose");
        }
        snakeHead.setAttribute('y', snakeY);
    }
    else if (currentDirection === 'd'){
        snakeY = snakeY + MOVE_DISTANCE;
        if (yOut(snakeY)){
            console.log("lose");
        }
        snakeHead.setAttribute('y', snakeY);
    }
}

function snakeGo () {
    if(!snakeMoving){
        snakeMoving = true;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveSnake, 100);
        moveSnake();
    }
}

function handleKeyDown(event) {
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
window.addEventListener('keydown', handleKeyDown);

function loseScreen(){
    // delete things off screen
    // have replay button? Or just tell to refresh
}
