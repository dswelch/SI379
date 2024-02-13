const NUM_ROWS = 3;
const NUM_COLS = 3;

const X = 'X';
const O = 'O';

let gameOver = false;
let currentPlayer = X;
function alternateCurrentPlayer() { // Update the current player
    if(currentPlayer === X) { currentPlayer = O; }
    else                    { currentPlayer = X; }
}

// `cell` is a TD element
function setCellValue(cell, value) { cell.innerText = value; }
function getCellValue(cell) { return cell.innerText; }
function isEmpty(cell) { return getCellValue(cell) === ''; }


function createBoard() {
    const table = document.createElement("table"); // Create a table
    document.body.append(table); // ...and add it to the body

    for(let i = 0; i < NUM_ROWS; i++) {
        const row = document.createElement("tr");  // Create a row
        table.append(row); // ...and add it to the table

        for(let j = 0; j < NUM_COLS; j++) {
            const cell = document.createElement("td"); // Create a cell
            row.append(cell); // ...and add it to the row
            cell.addEventListener("click", function(){
                clickOnCell(cell);
                getComputerMove((cell) => {
                    clickOnCell(cell);
                });
            })
        }
    }
}

function clickOnCell(cell){
    if(isEmpty(cell) && !gameOver){
        setCellValue(cell, currentPlayer);
        alternateCurrentPlayer();
        const res = getWinner();
        if (res != false){
            gameOver = true;
        }
    }
}

createBoard();

