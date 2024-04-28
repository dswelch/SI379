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
let foodLocation = [food.getAttribute('x'), food.getAttribute('y')];
let snakeTailArray = [snakeHead];

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
    xVal *= 20;
    yVal *= 20;
    food.setAttribute('x', xVal);
    food.setAttribute('y', yVal);
    foodLocation = [xVal, yVal];
}

function eatFood(){
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
    }, 100);
    // TODO increase score
    moveFood();
}

function moveSnake(){
    if (currentDirection === 'l'){
        snakeX = snakeX - MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('x', snakeX);
        for (let i=1; i<locationArray.length;i++){
            const newX = locationArray[i-1][0];
            const newY = locationArray[i-1][1];
            snakeTailArray[i].setAttribute('x', newX);
            snakeTailArray[i].setAttribute('y', newY);
            if (i > 1){
                locationArray[i-1] = locationArray[i-2];
            }
        }
        locationArray[0][0] = snakeX;
        if (locationArray.length > 1){
            locationArray[locationArray.length-1] = locationArray[locationArray.length-2];
        }
    }
    else if (currentDirection === 'r'){
        snakeX = snakeX + MOVE_DISTANCE;
        if (xOut(snakeX)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('x', snakeX);
        for (let i=1; i<locationArray.length;i++){
            const newX = locationArray[i-1][0];
            const newY = locationArray[i-1][1];
            snakeTailArray[i].setAttribute('x', newX);
            snakeTailArray[i].setAttribute('y', newY);
            if (i > 1){
                locationArray[i-1] = locationArray[i-2];
            }
        }
        locationArray[0][0] = snakeX;
        if (locationArray.length > 1){
            locationArray[locationArray.length-1] = locationArray[locationArray.length-2];
        }
    }
    else if (currentDirection === 'u'){
        snakeY = snakeY - MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('y', snakeY);
        for (let i=1; i<locationArray.length;i++){
            const newX = locationArray[i-1][0];
            const newY = locationArray[i-1][1];
            snakeTailArray[i].setAttribute('x', newX);
            snakeTailArray[i].setAttribute('y', newY);
            if (i > 1){
                locationArray[i-1] = locationArray[i-2];
            }
        }
        locationArray[0][1] = snakeY;
        if (locationArray.length > 1){
            locationArray[locationArray.length-1] = locationArray[locationArray.length-2];
        }
    }
    else if (currentDirection === 'd'){
        snakeY = snakeY + MOVE_DISTANCE;
        if (yOut(snakeY)){
            loseScreen();
        }
        if(onFood()){
            eatFood();
        }
        snakeHead.setAttribute('y', snakeY);
        for (let i=1; i<locationArray.length;i++){
            const newX = locationArray[i-1][0];
            const newY = locationArray[i-1][1];
            snakeTailArray[i].setAttribute('x', newX);
            snakeTailArray[i].setAttribute('y', newY);
            if (i > 1){
                locationArray[i-1] = locationArray[i-2];
            }
        }
        locationArray[0][1] = snakeY;
        if (locationArray.length > 1){
            locationArray[locationArray.length-1] = locationArray[locationArray.length-2];
        }
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

    // reset food
    foodLocation = [112.5, 52.5];
    food.setAttribute('x', foodLocation[0]);
    food.setAttribute('y', foodLocation[1]);

    // put in restart button
    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart game?";
    document.body.append(restartButton);
    restartButton.addEventListener("click", () => {
        lost = false;
        document.body.append(svgElement);
        restartButton.remove();
    });
}
