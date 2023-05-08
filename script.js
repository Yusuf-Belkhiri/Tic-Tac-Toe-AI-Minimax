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
    // Check if cell can be selected
    if(typeof(origBoard[cell.target.id]) != 'number')
        return;
    
    if(selectCell(cell.target.id, humanPlayer))
        return;

    // AI turn
    if(!checkDraw()) selectCell(bestSpot(), aiPlayer);
}

function selectCell(cellId, player){
    origBoard[cellId] = player;
    cells[cellId].innerText = player;
    //document.getElementById(cellId).innerText = player;

    let gameWon = checkWin(origBoard, player);
    if(gameWon)
        gameOver(gameWon);

    return gameWon;              // Check if the game is won before checking if draw
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

    declareWinner(gameWon.player == humanPlayer ? "You Win !" : "You Lose !");
}

function declareWinner(winnerText){
    // document.querySelector(".endgame").style.display = "block";
    // document.querySelector(".endgame.text").innerText = winnerText;

    console.log(winnerText);
}

function getEmptySpots(board){
    return board.filter(cell => typeof(cell) == 'number');
}

function bestSpot(){
    //return getEmptyCells(origBoard)[0];
    return minimax(origBoard, aiPlayer).index;
}

function checkDraw(){
    if(getEmptySpots(origBoard).length > 0) 
        return false;

    for(let cell of cells){
        cell.style.backgroundColor = 'green';
        cell.removeEventListener('click', onClickCell, false);
    }
    declareWinner("Draw!");
    return true;
}


/// Returns move{index, score}
/// if player == aiPlayer: returns the move with best score
/// if player == humanPlayer: returns the move with the lowest score
function minimax(newBoard, player){
    let availableSpots = getEmptySpots(newBoard);       // indexes, ex: 1, 4, 6

    // Check terminal states: someone winning
    if(checkWin(newBoard, humanPlayer))         // player wins
        return {score: -10};
    else if (checkWin(newBoard, aiPlayer))      // ai wins
        return {score: 10}
    else if (availableSpots.length == 0)        // draw
        return {score: 0}

    // Collect scores from each of the empty spots to evaluate later
    var moves = [];     // contains the children scores & indexes
    for(var i = 0; i < availableSpots.length; i++){
        var move = {};      // move {index, score}
        move.index = newBoard[availableSpots[i]];       // to reset the newboard later & return the best move index
        newBoard[availableSpots[i]] = player;
        
        // RECURSIVITY, Switch turns
        if(player == aiPlayer){
            move.score = minimax(newBoard, humanPlayer).score;
        }else{
            move.score = minimax(newBoard, aiPlayer).score;
        }

        // reset the newboard (Back from recursivity)
        newBoard[availableSpots[i]] = move.index;
        
        moves.push(move);
    }

    var bestMove;
    // If Ai turn: pick highest score       (select)
    if(player == aiPlayer){
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestMove = moves[i];
                bestScore = moves[i].score;
            }
        }
    }  // If Player turn: pick lowest score    (evaluate)
    else{
        var lowestScore = 10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score < lowestScore){
                bestMove = moves[i];
                lowestScore = moves[i].score;
            }
        }
    }

    return bestMove;
}