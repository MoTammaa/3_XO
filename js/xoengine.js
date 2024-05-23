
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
    startGame(1);
    updateGrid();
}

function startGame(Mode) {
    gamestate = 1;
    winner = -1;
    mode = Mode;
    //randomly choose who starts
    turn = Math.floor(Math.random() * 2);
    console.log(turn);
    recentMoves = [];
    for (var i = 0; i < 9; i++) {
        grid[i] = 0;
    }
    if (turn == 1) {
        computerMove();
    }
}

function computerMove() {
        console.log(grid);
    if (mode == 1) {
        if (recentMoves.length < 3){
            move = Math.floor(Math.random() * 5) * 2;
            while (grid[move] != 0) {
                move = Math.floor(Math.random() * 9);
            }
            addMove(move);
            return;
        }
        var correctnessPercentage = 0;
        if (difficulty == 0) {
            correctnessPercentage = 0.4;
        } else if (difficulty == 1) {
            correctnessPercentage = 0.7;
        } else {
            correctnessPercentage = 0.99;
        }
        // choose 
        var best = getBestMove(0, 1, grid.slice(), -1, recentMoves.slice());

        var cell = best[0];
        if (cell == -1) {
            // random move
            cell = Math.floor(Math.random() * 9);
            while (grid[cell] != 0) {
                cell = Math.floor(Math.random() * 9);
            }
        } 
        else if (grid[cell] != 0 && !(recentMoves.length > 5 && (recentMoves[0] == cell || recentMoves[1] == cell))) {
            // random move
            var cell = Math.floor(Math.random() * 9);
            while (grid[cell] != 0) {
                cell = Math.floor(Math.random() * 9);
            }
        }
        console.log("best move: " + cell);
        addMove(cell);

        // turn = 1 - turn;
    }
}

function ArrayToOneString(arr){return arr.join('');}

var dp = new Map();

function getBestMove(depth, player, grid, original = -1, recentmoves) {
    // 1 is Computer, 0 is Human
    var key = ArrayToOneString(grid);
    // if (dp.has(key)) {
    //     return dp.get(key);
    // }
    if (depth > 100) return [-1, depth];

    // brute force
    var winner = getWinner(grid);
    if (winner == 1) {
        // return a pair of (score, depth)
        dp.set(key, 1);
        return [original, depth];
    } else if (winner == 0) {
        dp.set(key, -1);
        return [-1, depth];
    }
    // Check if the grid is full
    if (!grid.includes(0)) {return [-1, depth];}

    var min = [-1, 1000];
// try to stop the player from winning
    // add the move to the grid
    var tempmoves = recentmoves.slice();
    var tempgrid = grid.slice();
    if (recentmoves.length > 4) {
        tempgrid[recentmoves.shift()] = 0;
    }if (recentmoves.length > 4) {
        tempgrid[recentmoves.shift()] = 0;
    }

    // check if the player is about to win
    if (tempgrid[4] == 1 && tempgrid[6] == 1) console.log("interesting");
    for (var i = 0; i < 9; i++) {
        if (tempgrid[i] == 0
            || (tempmoves.length > 5 &&((tempmoves.length > 0 && i == tempmoves[0]) || (tempmoves.length > 1 && i == tempmoves[1])))
        ) {
            var newGrid = tempgrid.slice();
            var newRecentMoves = tempmoves.slice();
            newRecentMoves.push(i);
            if (newRecentMoves.length > 6) {
                newRecentMoves.shift();
            }
            newGrid[i] = 1;
            var winner = getWinner(newGrid);
            if (winner == 0) {
                min = [i, depth];
                // console.log("found a move to stop the player from winning");
                break;
            }
        }
    }
    if (min[0] == -1) {
        for (var i = 0; i < 9; i++) {
            if (grid[i] == 0 
                //|| (recentmoves.length > 0 && i == recentmoves[0]) || (recentmoves.length > 1 && i == recentmoves[1])
            ) {
                var newGrid = grid.slice();
                var newRecentMoves = recentmoves.slice();
                newRecentMoves.push(i);
                if (newRecentMoves.length > 6) {
                    newRecentMoves.shift();
                }
                newGrid[i] = player + 1;

                var moveScore = getBestMove(depth + 1, 1 - player, newGrid, original == -1 ? i : original, newRecentMoves);
                if (moveScore[0] > 0) {
                    if (moveScore[1] < min[1] ) {
                        min = moveScore;
                    }
                }
            }
        }
    }

    dp.set(key, min);
    return min;
}



            

function addMove(cell) {
    if (gamestate == 1 && 
        ( 
            grid[cell] == 0 
            ||(recentMoves.length > 5 && grid[cell] == turn+1 && (cell == recentMoves[0] || cell == recentMoves[1]))
        )) {
        recentMoves.push(cell);
        if (recentMoves.length > 6) {
            var num = recentMoves.shift();
            console.log("removed move " + num + " " + (grid[num] == 1 ? "X" : "O"));
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
function getWinner(grid) {
    for (var i = 0; i < 8; i++) {
        var a = winningCombinations[i][0];
        var b = winningCombinations[i][1];
        var c = winningCombinations[i][2];
        if (grid[a] != 0 && grid[a] == grid[b] && grid[b] == grid[c]) {
            return grid[a] - 1;
        }
    }

    var draw = true;
    for (var i = 0; i < 9; i++) {
        if (grid[i] == 0) {
            draw = false;
            break;
        }
    }
    if (draw) {
        return 3;
    }
    return -1;
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
