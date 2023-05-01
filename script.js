var origBoard;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell')

startGame();

function startGame(){
    //document.querySelector(".endgame").style.display = "None"
    origBoard = Array.from(Array(9).keys());

    // init game board (start)
    for (var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', onClickCell, false);
    }
}

function onClickCell(cell){
    selectCell(cell.target.id, humanPlayer);
}

function selectCell(cellId, player){
    origBoard[cellId] = player;
    cells[cellId].innerText = player;
    //document.getElementById(cellId).innerText = player;

    let gameWon = checkWin(origBoard, player);
    if(gameWon)
        gameOver(gameWon);
}

function checkWin(board, player){
    // Get all the current player's plays
    let plays = board.reduce((a, e, i) =>       // Array.reduce(callbackfct) a: accumulator(return value), it accumulates the callback's return values
     (e === player) ? a.concat(i) : a, []);        // e: element, i: index, []: initial value of a 

    // Check if any winCombo is achieved
    let gameWon = null;
    for(let [winComboIndex, winCombo] of winCombos.entries()){
        if(winCombo.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {winComboIndex: winComboIndex, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    // Colorize winCombo cells
    for(let cellIndex of winCombos[gameWon.winComboIndex]){
        document.getElementById(cellIndex).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
    }

    // Disable click event
    for(let cell of cells){
        cell.removeEventListener('click', onClickCell, false);
    }
}