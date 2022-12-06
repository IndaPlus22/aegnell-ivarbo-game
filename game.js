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
             [e, e, B, W, e, e],
             [e, e, W, B, e, e],
             [e, e, e, e, e, e],
             [e, e, e, e, e, e]];

// Black goes first
let player = B;
let turn = 1;

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
    if (board[row][col] != e && board[row][col] != p) {
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
    turn++;   
    updateBoard();
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
            button.addEventListener("click", testPosition)
            document.getElementById("canvas").append(button);
        }
    }
    
    // Update the board
    updateBoard();
}


//när man klickar på en plats
function testPosition(event) {
    let coordinates = event.target.getAttribute("data-coordinates")
    let row = parseInt(coordinates[0]);
    let col = parseInt(coordinates[2]);
    
    if (board[row][col] == p) {
        makeMove(row, col);
    }
}



// Update visual representation of the board
function updateBoard() {
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
            if (board[r][c] == p) {
                board[r][c] = e;
            }
            // Adds colored markers at each non-empty spaces
            if (board[r][c] == e) {
                buttons[buttNum].classList.add("empty");
            } else if (board[r][c] == W) {
                buttons[buttNum].classList.add("white");
            } else if (board[r][c] == B) {
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
    document.getElementById("black").innerHTML = "Black: " + score(B);
    document.getElementById("white").innerHTML = "White: " + score(W);

    // Generate new possible moves
    buttNum = 0;
    for (r = 0; r < 6; r++) {
        for (c = 0; c < 6; c++) {
            if (isValidMove(r,c)) {
                board[r][c] = p;
                buttons[buttNum].className = "";
                buttons[buttNum].classList.add("possible");
            }
            buttNum++;;
        }
    }
    if (gameOver()) {
        alert(winner());
    }
}






// Print the board
function drawBoard() {
    for (var row = 0; row < 6; row++) {
        var line = "";
        for (var col = 0; col < 6; col++) {
            if (board[row][col] == B) {
                line += "B";
            } else if (board[row][col] == W) {
                line += "W";
            } else if (board[row][col] == e){
                line += "e";
            } else {
                line += "p";
            }
        }
        console.log(line);
    }
}

// Returns true if the game is over
function gameOver() {
    // Check if there are any valid moves
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (isValidMove(row, col)) {
                return false;
            }
        }
    }

    // No valid moves were found
    return true;
}

// Returns the score for the given color
function score(color) {
    var s = 0
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 6; col++) {
            if (board[row][col] == color) {
                s++;
            }
        }
    }
    return s;

}

// Returns the winner of the game
function winner() {
    var blackScore = score(B);
    var whiteScore = score(W);
    if (blackScore > whiteScore) {
        return "Black wins!";
    } else if (whiteScore > blackScore) {
        return "White wins!";
    } else {
        return "It's a tie!";
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
console.log(winner());
