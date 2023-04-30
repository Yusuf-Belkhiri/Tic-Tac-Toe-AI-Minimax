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
        cells[i].addEventListener('click', onCellClick, false);
    }
}

function onCellClick(cell){
    selectCell(cell.target.id, humanPlayer);
}

function selectCell(cellId, player){
    origBoard[cellId] = player;
    cells[cellId].innerText = player;
    //document.getElementById(cellId).innerText = player;
}