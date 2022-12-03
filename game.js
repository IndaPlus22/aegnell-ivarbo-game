//// Othello/Reversi game logic ////

// e represents a blank space
// W represents a white piece
// B represents a black piece
const e = 0;
const B = 1;
const W = 2;

// The board is 6x6 and is represented as a 2D array
// The first index is the row, the second is the column
// The board is initialized with the starting pieces
let board = [[e, e, e, e, e, e],
             [e, e, e, e, e, e],
             [e, e, B, W, e, e],
             [e, e, W, B, e, e],
             [e, e, e, e, e, e],
             [e, e, e, e, e, e]];

// Black goes first
let player = B;

//// Game logic ////

// Returns the opposite color
function opposite(color) {
    if (color == B) {
        return W
    } else {
        return B
    }
}

// Returns true if the given coordinates are on the board
function onBoard(row, col) {
    return row >= 0 && row < 6 && col >= 0 && col < 6
}

// Returns true if the given move is valid
function isValidMove(row, col) {
    // Check if the space is blank
    if (board[row][col] != e) {
        return false
    }

    // Check if the move captures any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            if (checkDirection(row, col, drow, dcol)) {
                return true
            }
        }
    }

    // No pieces were captured
    return false
}

// Checks if the given move in the given direction captures any pieces
function checkDirection(row, col, drow, dcol) {
    // Check if the move is out of bounds
    if (!onBoard(row + drow, col + dcol)) {
        return false
    }

    // Check if the next space is the opposite color
    if (board[row + drow][col + dcol] != opposite(player)) {
        return false
    }

    // Check if there are any pieces of the same color after the opposite color
    var r = row + drow
    var c = col + dcol
    while (onBoard(r + drow, c + dcol)) {
        r += drow
        c += dcol
        if (board[r][c] == player) {
            return true
        } else if (board[r][c] == e) {
            return false
        }
    }

    // No pieces of the same color were found
    return false
}

function capturePieces(row, col, drow, dcol) {
    // Check if the move is out of bounds
    if (!onBoard(row + drow, col + dcol)) {
        return
    }

    // Check if the next space is the opposite color
    if (board[row + drow][col + dcol] != opposite(player)) {
        return
    }

    // Check if there are any pieces of the same color after the opposite color
    var r = row + drow
    var c = col + dcol
    while (onBoard(r + drow, c + dcol)) {
        r += drow
        c += dcol
        if (board[r][c] == player) {
            // Capture the pieces
            r = row + drow
            c = col + dcol
            while (board[r][c] != player) {
                board[r][c] = player
                r += drow
                c += dcol
            }
            return
        } else if (board[r][c] == e) {
            return
        }
    }
}

// Makes the given move and captures any pieces
function makeMove(row, col) {
    // Place the piece
    board[row][col] = player

    // Capture any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            capturePieces(row, col, drow, dcol)
        }
    }

    // Switch players
    player = opposite(player)
}

// Initializes canvas containing the board
function draw() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Draw the board
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 300, 300);

    // Draw the pieces
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (board[row][col] == B) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(25 + 50 * col, 25 + 50 * row, 20, 0, 2 * Math.PI);
                ctx.fill();
            } else if (board[row][col] == W) {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(25 + 50 * col, 25 + 50 * row, 20, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

// Print the board
function drawBoard() {
    for (var row = 0; row < 6; row++) {
        var line = ""
        for (var col = 0; col < 6; col++) {
            if (board[row][col] == B) {
                line += "B"
            } else if (board[row][col] == W) {
                line += "W"
            } else {
                line += "e"
            }
        }
        console.log(line)
    }
}

// Returns true if the game is over
function gameOver() {
    // Check if there are any valid moves
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (isValidMove(row, col)) {
                return false
            }
        }
    }

    // No valid moves were found
    return true
}

// Returns the score for the given color
function score(color) {
    var s = 0
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (board[row][col] == color) {
                s++
            }
        }
    }
    return s

}

// Returns the winner of the game
function winner() {
    var blackScore = score(B)
    var whiteScore = score(W)
    if (blackScore > whiteScore) {
        return "Black wins!"
    } else if (whiteScore > blackScore) {
        return "White wins!"
    } else {
        return "It's a tie!"
    }
}

//// Main program ////

// Handle input
const readlineSync = require('readline-sync');

// Play the game
printBoard()
while (!gameOver()) {
    // Get the player's move
    let answer = readlineSync.question("Enter the row and column of your move: ");
    var row = parseInt(answer[0]);
    var col = parseInt(answer[2]);
    if (isValidMove(row, col)) {
        makeMove(row, col);
        printBoard();
    } else {
        console.log("Invalid move!");
    }
}

// Print the winner
console.log(winner())
