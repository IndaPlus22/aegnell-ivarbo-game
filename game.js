//// Othello/Reversi game logic ////

// e represents a blank space
// W represents a white piece
// B represents a black piece
const e = 0;
const B = 1;
const W = 2;
const p = 3;

// The board is 6x6 and is represented as a 2D array
// The first index is the row, the second is the column
// The board is initialized with the starting pieces
let board = [[e, e, e, e, e, e],
             [e, e, e, e, e, e],
             [e, e, W, B, e, e],
             [e, e, B, W, e, e],
             [e, e, e, e, e, e],
             [e, e, e, e, e, e]];

// Black goes first
let player = B;
let cpu = opposite(player);

//// Game logic ////

// Returns the opposite color
function opposite(color) {
    if (color == B) {
        return W;
    } else {
        return B;
    }
}

// Returns true if the given coordinates are on the board
function onBoard(row, col) {
    return row >= 0 && row < 6 && col >= 0 && col < 6
}

// Returns true if the given move is valid
function isValidMove(currentBoard, row, col) {
    // Check if the space is blank
    if (currentBoard[row][col] != e && currentBoard[row][col] != p) {
        return false;
    }

    // Check if the move captures any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            if (checkDirection(currentBoard, row, col, drow, dcol)) {
                return true;
            }
        }
    }

    // No pieces were captured
    return false;
}

// Checks if the given move in the given direction captures any pieces
function checkDirection(currentBoard, row, col, drow, dcol) {
    // Check if the move is out of bounds
    if (!onBoard(row + drow, col + dcol)) {
        return false
    }

    // Check if the next space is the opposite color
    if (currentBoard[row + drow][col + dcol] != opposite(player)) {
        return false
    }

    // Check if there are any pieces of the same color after the opposite color
    var r = row + drow
    var c = col + dcol
    while (onBoard(r + drow, c + dcol)) {
        r += drow
        c += dcol
        if (currentBoard[r][c] == player) {
            return true
        } else if (currentBoard[r][c] == e) {
            return false
        }
    }

    // No pieces of the same color were found
    return false
}

// Captures pieces in the given direction
function capturePieces(currentBoard, row, col, drow, dcol) {
    // Check if the move is out of bounds
    if (!onBoard(row + drow, col + dcol)) {
        return
    }

    // Check if the next space is the opposite color
    if (currentBoard[row + drow][col + dcol] != opposite(player)) {
        return
    }

    // Check if there are any pieces of the same color after the opposite color
    var r = row + drow
    var c = col + dcol
    while (onBoard(r + drow, c + dcol)) {
        r += drow
        c += dcol
        if (currentBoard[r][c] == player) {
            // Capture the pieces
            r = row + drow
            c = col + dcol
            while (currentBoard[r][c] != player) {
                currentBoard[r][c] = player
                r += drow
                c += dcol
            }
            return
        } else if (currentBoard[r][c] == e) {
            return
        }
    }
}

// Makes the given move and captures any pieces
function makeMove(currentBoard, row, col) {
    // Place the piece
    currentBoard[row][col] = player

    // Capture any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            capturePieces(currentBoard, row, col, drow, dcol)
        }
    }

    // Switch players
    player = opposite(player)
    turn++;   
    updateBoard(currentBoard);
    
    if (gameOver(currentBoard)) {
        let gameOver = document.getElementById("gameOver")
        gameOver.innerHTML = winner(currentBoard);
        gameOver.style.zIndex = "100";
    }
}

// Initializes canvas containing the board
function makeBoard() {
    // Create and place buttons representing each space on the board
    turn = 1;
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            let button = document.createElement("button");
            button.setAttribute("data-coordinates", [r,c]);
            //button.classList.add("knapp");
            button.addEventListener("click", (event => testPosition(board, event)));
            document.getElementById("canvas").append(button);
        }
    }
    
    // Update the board
    updateBoard(board);
}

// Test if given position of move is valid
function testPosition(currentBoard, event) {
    let coordinates = event.target.getAttribute("data-coordinates")
    let row = parseInt(coordinates[0]);
    let col = parseInt(coordinates[2]);
    
    if (currentBoard[row][col] == p) {
        makeMove(currentBoard, row, col);
    }
}

// Update visual representation of the board
function updateBoard(currentBoard) {
    // Reset CSS theming of all markers
    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i < (6*6); i++) {
        buttons[i].className = "";
    }
    
    // Update CSS theming of markers
    let buttNum = 0;
    for (r = 0; r < 6; r++) {
        for (c = 0; c < 6; c++) {

            // Possible spaces are cleared
            if (currentBoard[r][c] == p) {
                currentBoard[r][c] = e;
            }

            // Adds colored markers at each non-empty spaces
            if (currentBoard[r][c] == e) {
                buttons[buttNum].classList.add("empty");
            } else if (currentBoard[r][c] == W) {
                buttons[buttNum].classList.add("white");
            } else if (currentBoard[r][c] == B) {
                buttons[buttNum].classList.add("black");
            }

            // Increment button position
            buttNum++;
        }
    }

    // Update current player and score
    let playerIcon = "";
    if (player == W) { playerIcon = "⚪" } else { playerIcon = "⚫" }
    document.getElementById("player").innerHTML = "Player: " + playerIcon;
    document.getElementById("black").innerHTML = "Black: " + score(currentBoard, B);
    document.getElementById("white").innerHTML = "White: " + score(currentBoard, W);

    // Generate new possible moves
    buttNum = 0;
    for (r = 0; r < 6; r++) {
        for (c = 0; c < 6; c++) {
            if (isValidMove(currentBoard, r, c)) { // possibly incorrect?
                currentBoard[r][c] = p;
                buttons[buttNum].className = "";
                buttons[buttNum].classList.add("possible");
            }
            buttNum++;;
        }
    }
}

// Returns true if the game is over
function gameOver(currentBoard) {
    // Check if there are any valid moves
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (isValidMove(currentBoard, row, col)) { // possibly incorrect?
                return false;
            }
        }
    }

    // No valid moves were found
    return true;
}

// Returns the score for the given color
function score(currentBoard, color) {
    var s = 0
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (currentBoard[row][col] == color) {
                s++;
            }
        }
    }
    return s;

}

// Returns the winner of the game
function winner(currentBoard) {
    var blackScore = score(currentBoard, B);
    var whiteScore = score(currentBoard, W);
    if (blackScore > whiteScore) {
        return "Black wins!";
    } else if (whiteScore > blackScore) {
        return "White wins!";
    } else {
        return "It's a tie!";
    }
}

//// Main program ////

// // Handle input
// const readlineSync = require('readline-sync');

// // Play the game
// printBoard()
// while (!gameOver()) {
//     // Get the player's move
//     let answer = readlineSync.question("Enter the row and column of your move: ");
//     var row = parseInt(answer[0]);
//     var col = parseInt(answer[2]);
//     if (isValidMove(currentBoard, row, col)) { // possibly incorrect?
//         makeMove(currentBoard, row, col);
//         printBoard(currentBoard);
//     } else {
//         console.log("Invalid move!");
//     }
// }


function logBoard(currentBoard) {
    for (let r = 0; r < 6; r++) {
        console.log(b[r][0] + ", " + b[r][1] + ", " + b[r][2] + ", " + b[r][3] + ", " + b[r][4] + ", " + b[r][5] + "     " + r)
    }
    console.log(".")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////
////        Adams minmax
////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function adamsClick() {
    //depth of minmax
    let depth = 4;


    let originalBoard = structuredClone(board);
    cpu = player;
    let possibleScore = [];
    let checkGameOver = true;

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            possibleScore[(r*6 + c)] = -1;
            if (board[r][c] == p) {
                //if there is possible moves the computer has to make one
                checkGameOver = false;
                possibleScore[(r*6 + c)] = 0;

                //test a move
                adamsMakeMove(r,c);
                board = adamsUpdateBoard(board);
                
                //see the score of all possible moves on the board
                possibleScore[(r*6 + c)] = adamsMinmax(depth, true);
                board = structuredClone(originalBoard);
            }
        }
    }
    //if there were possible moves
    if (!checkGameOver) {
        let max = -1;
        let maxPosition = 0;
        for (let i = 0; i < 36; i++) {
            //max is the highest possible score
            if (max < possibleScore[i]) {
                max = possibleScore[i];
                //maxPosition is the position of the highest possible score
                maxPosition = i;
            }
        }

        //makes the position to row and column coordinates
        let row = Math.floor(maxPosition / 6);
        let col = maxPosition % 6;

        //make a move based on the highest possible score
        board = structuredClone(originalBoard);
        player = cpu;
        makeMove(board, row, col);
    }
}

//minmax function
function adamsMinmax(depth, maximize) {
    //if depth = 0 then just return the score
    if (depth == 0) {
        return score(board, cpu);
    } 
    // if the goal is to maximize score
    if (maximize) {
        value = -1;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                //tests every possible placement
                if (board[r][c] == p) {
                    let currBoard = structuredClone(board);

                    //test a move
                    player = cpu;
                    adamsMakeMove(r,c);
                    board = adamsUpdateBoard(board);

                    //see the possible value of this move
                    value = Math.max(value, adamsMinmax(depth-1, false));

                    //reset the board to before the computer made a possible move
                    board = structuredClone(currBoard);
                }
            }
        }
    //if goal is to minimize score
    } else {
        value = 37;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                //tests every possible placement
                if (board[r][c] == p) {
                    let currBoard = structuredClone(board);

                    //test a move
                    player = opposite(cpu);
                    adamsMakeMove(r,c);
                    board = adamsUpdateBoard(board);

                    //see the possible value of this move
                    value = Math.min(value, adamsMinmax(depth-1, true));

                    //reset the board to before the computer made a possible move
                    board = structuredClone(currBoard);

                }
            }
        }
    }

    if (value == -1 || value == 37) {value = score(board, cpu);}
    return value;
}

//updates the possible places on the board
function adamsUpdateBoard(board) {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            //resets possible moves
            if (board[r][c] == p) {
                board[r][c] = e;
            }
            //make new possible moves
            if (board[r][c] == e && isValidMove(board, r, c)) {
                board[r][c] = p;
            }
        }
    }
    return board;
}


//makes a move without telling the game it is the computers move
function adamsMakeMove(row, col) {
    // Place the piece
    board[row][col] = player;

    // Capture any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            capturePieces(board, row, col, drow, dcol)
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////
////        Ivars minmax
////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ivarsClick() {
    ivarsMonteCarlo(board, player);
}

function ivarsReturnValidMoves(currentBoard) {
    let validMoves = [];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (isValidMove(currentBoard, r, c)) {
                validMoves.push([r, c]);
            }
        }
    }

    return validMoves;
}

// Simulates game from starting board n times, tallies statistics
function ivarsSimulate(currentBoard, player, n) {
    let simulatedWins = 0;
    let simulatedGames = 0;
    
    for (let i = 0; i < n; i++) {
        while (!gameOver(currentBoard)) {
            const validMoves = ivarsReturnValidMoves(currentBoard);
            const moveIndex = Math.floor(Math.random() * length(validMoves));
            const nextMove = validMoves[moveIndex];
            currentBoard = ivarsMakeMove(currentBoard, nextMove[0], nextMove[1]);
        }
        
        simulatedGames++;
        if (score(currentBoard, player) > score(currentBoard, opposite(player))) {
            simulatedWins++;
        }
    }

    return [simulatedWins, simulatedGames];
}

// Pure Monte Carlo tree search
function ivarsMonteCarlo(currentBoard, player) {
    let nextMove = {"r": 0, "c": 0, "wr": 0};

    ivarsReturnValidMoves(currentBoard).forEach(move => {
        const nextBoard = makeMove(currentBoard, move[0], move[1]);
        const [simulatedWins, simulatedGames] = ivarsSimulate(nextBoard, player, 100);
        const wr = simulatedWins / simulatedGames;

        if (wr > nextMove.wr) {
            nextMove.r, nextMove.c, nextMove.wr = move.r, move.c, wr;
        }
    });

    ivarsMakeMove(currentBoard, nextMove.r, nextMove.c);
}

function ivarsUpdateBoard(board) {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (board[r][c] == p) {
                board[r][c] = e;
            }
            if (board[r][c] == e && isValidMove(currentBoard, r,c)) {
                board[r][c] = p;
            }
        }
    }
    return board;
}

function ivarsMakeMove(currentBoard, row, col) {
    currentBoard[row][col] = player;
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            capturePieces(currentBoard, row, col, drow, dcol);
        }
    }
}