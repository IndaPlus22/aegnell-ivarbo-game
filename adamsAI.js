const W = 2;
const B = 1;
const human = B;
const cpu = W;

function click() {
    let depth = 2;
    let originalBoard = board;

    let max = -2;
    let maxPosition = 0;
    let possibleScore = [];

    let maxValue = -1;
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            possibleScore[(r + c*6)] = 0;
            if (board[r][c] == "p") {
                easyMakeMove(r,c);
                board = easyUpdateBoard(board);
            
                possibleScore[(r + c*6)] = minmax(board, depth, false);

                board = originalBoard;
            }
        }
    }

    for (let i = 0; i < 36; i++) {
        if (max < possibleScore[i]) {
            maxPosition = i;
        }
    }

    let row = i % 6;
    let col = 1 / 6;
    makeMove(row, col);
}

function minmax(board, depth, maximize) {
    if (depth == 0) {
        maxValue = max(maxValue,score(cpu));
        return score(cpu);
    } 
    if (maximize) {
        value = -1;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (board[r][c] == "p") {
                    let currBoard = board;
                    player = cpu;
                    easyMakeMove(r,c);
                    board = easyUpdateBoard(board);

                    value = Math.max(value, minmax(board, depth-1, false));

                    board = currBoard;
                }
            }
        }
    } else {
        value = 37;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (board[r][c] == "p") {

                    let currBoard = board;
                    player = human;
                    easyMakeMove(r,c);
                    board = easyUpdateBoard(board);
                    value = Math.min(value, minmax(board, depth-1, true));

                    board = currBoard;

                }
            }
        }
    }
    return value;
}

function easyUpdateBoard(board) {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (board[r][c] == "p") {
                board[r][c] = "e";
            }
            if (board[r][c] == "e" && isValidMove(r,c)) {
                board[r][c] = "p";
            }
        }
    }
    return board;
}

function easyMakeMove(row, col) {
    // Place the piece
    board[row][col] = player;

    // Capture any pieces
    for (var drow = -1; drow <= 1; drow++) {
        for (var dcol = -1; dcol <= 1; dcol++) {
            capturePieces(row, col, drow, dcol)
        }
    }
}