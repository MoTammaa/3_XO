
var turn = 1; // 1 for X, 0 for O
var mode = 0; // 0 for player vs player, 1 for player vs computer
var difficulty = 0; // 0 for easy, 1 for medium, 2 for hard
var gamestate = 0; // 0 for not started, 1 for started, 2 for ended
var winner = -1; // 0 for O, 1 for X, -1 for none
var score1 = 0; // score for player 1
var score2 = 0; // score for player 2
var grid = new Array(9);// game grid, 0 for empty, 1 for X, 2 for O
var recentMoves = []; // recent moves
var winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; // winning combinations

//onload
window.onload = function () {
    startGame(0);
    updateGrid();
}

function startGame(Mode) {
    gamestate = 1;
    winner = -1;
    mode = Mode;
    //randomly choose who starts
    turn = Math.floor(Math.random() * 2);
    recentMoves = [];
    for (var i = 0; i < 9; i++) {
        grid[i] = 0;
    }
    if (turn == 0) {
        computerMove();
    }
}

function computerMove() {
    if (mode == 1) {
        var correctnessPercentage = 0;
        if (difficulty == 0) {
            correctnessPercentage = 0.4;
        } else if (difficulty == 1) {
            correctnessPercentage = 0.7;
        } else {
            correctnessPercentage = 0.99;
        }
        // choose




        turn = 1 - turn;
    }
}

            

function addMove(cell) {
    if (gamestate == 1 && ( grid[cell] == 0 
        || (recentMoves.length > 0 && cell == recentMoves[0]) || (recentMoves.length > 1 && cell == recentMoves[1]))) {
        recentMoves.push(cell);
        if (recentMoves.length > 6) {
            var num = recentMoves.shift();
            // remove the oldest move
            grid[num] = 0;
        }
        grid[cell] = turn + 1;
        checkWinner();
        turn = 1 - turn;
        updateGrid();
        if (mode == 1 && gamestate == 1 && turn == 1) {
            computerMove();
        }
        updateGrid();
    }
}

function checkWinner() {
    //check for winner
    for (var i = 0; i < 8; i++) {
        var a = winningCombinations[i][0];
        var b = winningCombinations[i][1];
        var c = winningCombinations[i][2];
        if (grid[a] != 0 && grid[a] == grid[b] && grid[b] == grid[c]) {
            winner = grid[a] - 1;
            gamestate = 2;
            if (winner == 0) {
                score1++;
            } else {
                score2++;
            }
            // highlight the winning combination cells (parent of the cells)
            document.getElementById("cell" + a).parentElement.style.backgroundColor = "yellow";
            document.getElementById("cell" + b).parentElement.style.backgroundColor = "yellow";
            document.getElementById("cell" + c).parentElement.style.backgroundColor = "yellow";
            return;
        }
    }
    //check for draw
    var draw = true;
    for (var i = 0; i < 9; i++) {
        if (grid[i] == 0) {
            draw = false;
            break;
        }
    }
    if (draw) {
        gamestate = 2;
        winner = -1;
    }
}
    

function updateGrid(){
    for (var i = 0; i < 9; i++) {
        if (grid[i] == 1) {
            document.getElementById("cell" + i).innerHTML = "X";
        } else if (grid[i] == 2) {
            document.getElementById("cell" + i).innerHTML = "O";
        } else {
            document.getElementById("cell" + i).innerHTML = "";
        }
        document.getElementById("cell" + i).style.color = grid[i] == 1 ? "red" : "cyan";
        // set font size and make it bold
        document.getElementById("cell" + i).style.fontSize = "40px";
        document.getElementById("cell" + i).style.fontWeight = "bold";
        if (winner == -1){
            // remove background color
            document.getElementById("cell" + i).parentElement.style.backgroundColor = "transparent";
        }

        if (recentMoves.length > 0) {
            var num = recentMoves[0];
            if (grid[num] == 1) {
                document.getElementById("cell" + num).style.color = "brown";
            } else if (grid[num] == 2) {
                document.getElementById("cell" + num).style.color = "darkcyan";
            }

            if (recentMoves.length > 1) {
                var num = recentMoves[1];
                if (grid[num] == 1) {
                    document.getElementById("cell" + num).style.color = "brown";
                } else if (grid[num] == 2) {
                    document.getElementById("cell" + num).style.color = "darkcyan";
                }
            }
        } 
    }

    if (gamestate == 2) {
        if (winner == 1) {
            document.getElementById("message").innerHTML = "O wins!";
        } else if (winner == 0) {
            document.getElementById("message").innerHTML = "X wins!";
        } else {
            document.getElementById("message").innerHTML = "It's a draw!";
        }
    } else {
        if (turn == 1) {
            document.getElementById("message").innerHTML = "O's turn";
        } else {
            document.getElementById("message").innerHTML = "X's turn";
        }
    }
    document.getElementById("score1").innerHTML = score1;
    document.getElementById("score2").innerHTML = score2;
}

function newGame() {
    startGame(mode);
    updateGrid();
}
