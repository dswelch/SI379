function getComputerMove(callback) {
    const delay = Math.random() * 1000;
    const cells = document.querySelectorAll("td");
    const emptyCells = [];
    for(const cell of cells) {
        if(isEmpty(cell)) {
            emptyCells.push(cell);
        }
    }

    if(emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);

        setTimeout(() => {
            callback(emptyCells[randomIndex])
        }, delay);
    }
}

/*
Check if there is a winner and return the winner's value (X or O) or false if there is no winner.
*/
function getWinner() {
    // Get the cell at the given row and column
    function getCell(row, col) {
        return document.querySelector(`tr:nth-child(${row+1}) td:nth-child(${col+1})`);
    }

    // Check if all cells in the array contain the same non-empty value
    function containsWinner(cells) {
        return cells.every(cell => getCellValue(cell) === X) ||
               cells.every(cell => getCellValue(cell) === O);
    }

    // Add a class to each cell in the array
    function addClass(cells, className) {
        for(const cell of cells) {
            cell.classList.add(className);
        }
    }

    // Check each row for a winner
    for(let i = 0; i < NUM_ROWS; i++) {
        const row = [];
        for(let j = 0; j < NUM_COLS; j++) {
            row.push(getCell(i, j));
        }
        if(containsWinner(row)) {
            addClass(row, 'winner');
            return getCellValue(row[0]);
        }
    }

    // Check each column for a winner
    for(let j = 0; j < NUM_COLS; j++) {
        const col = [];
        for(let i = 0; i < NUM_ROWS; i++) {
            col.push(getCell(i, j));
        }
        if(containsWinner(col)) {
            addClass(col, 'winner');
            return getCellValue(col[0]);
        }
    }

    // Check each diagonal for a winner
    const diag1 = [];
    const diag2 = [];
    for(let i = 0; i < Math.min(NUM_ROWS, NUM_COLS); i++) {
        diag1.push(getCell(i, i));
        diag2.push(getCell(i, NUM_COLS - i - 1));
    }
    if(containsWinner(diag1)) {
        addClass(diag1, 'winner');
        return getCellValue(diag1[0]);
    }
    if(containsWinner(diag2)) {
        addClass(diag2, 'winner');
        return getCellValue(diag2[0]);
    }

    return false;
}