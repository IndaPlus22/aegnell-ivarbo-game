# 0 is empty
# 1 is black
# 2 is white
board = [[0,0,0,0]
        ,[0,0,0,0]
        ,[0,0,0,0]
        ,[0,0,0,0]]

counter = 0
while True:
    counter += 1
    if counter % 2 == 1:
        player = 1
    else:
        player = 2

    move = input(f"Player {player} move (example: A4): ")
    move = move.upper()
    move = move.strip()

    # Convert the move to a row and column
    row = ord(move[0]) - ord('A')
    col = int(move[1]) - 1

    # Make the move
    board[row][col] = 1 if player == 1 else 2

    # Flip pieces
    if row > 0 and board[row-1][col] == 2:
        board[row-1][col] = 1
    if row < 3 and board[row+1][col] == 2:
        board[row+1][col] = 1
    if col > 0 and board[row][col-1] == 2:
        board[row][col-1] = 1
    if col < 3 and board[row][col+1] == 2:
        board[row][col+1] = 1

    # Print the board
    for row in board:
        print(row)

    # Check for a winner
    for row in board:
        if row == [1,1,1,1]:
            print("You win!")
            exit()
