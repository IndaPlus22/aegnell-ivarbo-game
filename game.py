#######################################################################################
#
#   WTF (What To Fix):
#
#   - possible-moves funktionen är FUCKED
#
#   - check_line är typ wack o flippar alla förutom första ibland
#       fixa genom att lägga till en till check, fett fult
#
#
#######################################################################################

# 0 is empty
# 1 is black
# 2 is white
_ = 0,
B = 1,
W = 2
board = [[_,_,_,_]
        ,[_,W,B,_]
        ,[_,B,W,_]
        ,[_,_,_,_]]
max_col = 4
max_row = 4


def check_line(player: int, old_row: int, old_col:int, rel_row: int, rel_col: int):
        curr_row = old_row + rel_row
        curr_col = old_col + rel_col

        if curr_row < 0 or curr_col < 0:
            return False
        if curr_row >= max_row or curr_col >= max_col:
            return False

        if board[curr_row][curr_col] == player:
            return True
        if board[curr_row][curr_col] == 0:
            return False
        else: 
            if check_line(player, curr_row, curr_col, rel_row, rel_col):
                board[curr_row][curr_col] = player
                board[old_row][old_col] = player
                

def check_neighbours(player: int, check_row: int, check_col: int):
    for r in range(check_row-1, check_row+2):
        if r >= 0 and r < max_row:
            for c in range(check_col-1, check_col+2):
                if c >= 0 and c < max_col:
                    if board[r][c] != player and board[r][c] != 0:
                        if check_line(player, r, c, (r-check_row), (c-check_col)):
                            board[r][c] = player
                            print(f"{r}, {c}, {(r-check_row)}, {(c-check_col)}")



def check_possible_line(player: int, old_row: int, old_col:int, rel_row: int, rel_col: int):
        curr_row = old_row + rel_row
        curr_col = old_col + rel_col

        if curr_row < 0 or curr_col < 0:
            return False
        if curr_row >= max_row or curr_col >= max_col:
            return False

        if board[curr_row][curr_col] == player:
            return True
        if board[curr_row][curr_col] == 0:
            return False
        else: 
            return check_possible_line(player, curr_row, curr_col, rel_row, rel_col)

def possible_moves(this_board, player: int):
    moves_board = [[False,False,False,False]
                  ,[False,False,False,False]
                  ,[False,False,False,False]
                  ,[False,False,False,False]]

    row_counter = 0
    for rows in this_board:
        col_counter = 0
        for cols in rows:
            if cols != player and cols != 0:
                for r in range(-1, +2):
                    if row_counter + 2*r >= 0 and row_counter + 2*r < max_row:
                        for c in range(-1, +2):
                            if col_counter + 2*c >= 0 and col_counter + 2*c < max_col:

                                if board[row_counter + r][col_counter + c] == player:
                                    if board[row_counter + 2*r][col_counter + 2*c] != player and board[row_counter + 2*r][col_counter + 2*c] != 0:
                                        if check_possible_line(player, row_counter + 2*r, col_counter + 2*c, r, c): #???
                                            moves_board[row_counter][col_counter] = True


            col_counter += 1
        row_counter += 1

    row_counter = 0
    for rows in this_board:
        col_counter = 0
        for cols in rows:
            #if cols != 0:

                #moves_board[row_counter][col_counter] = False

            col_counter += 1
        row_counter += 1

    return moves_board

def possible_moves_2(board, player: int):
    moves = [[False,False,False,False]
            ,[False,False,False,False]
            ,[False,False,False,False]
            ,[False,False,False,False]]

    for i, line in enumerate(board):
        for j, cell in enumerate(line):
            

    return moves

possible_moves(board, 1)
possible_moves_2(board, 1)

counter = 0
while True:
    counter += 1
    if counter % 2 == 1:
        player = 1
    else:
        player = 2
    
    while True:
        move = input(f"Player {player} move (example: A4): ")
        move = move.upper()
        move = move.strip()

        # Convert the move to a row and column
        row = ord(move[0]) - ord('A')
        col = int(move[1]) - 1


        if board[row][col] != 0:
            print("Already a piece there, try again.")
        else:
            break

    # Make the move
    board[row][col] = player
    check_neighbours(player, row, col)
    check_neighbours(player, row, col) #annars kan den missa en typ

    # Print the board
    for row in board:
        for x in row:
            if x == 0: print("  ",end="")
            if x == 1: print("☺ ",end="")
            if x == 2: print("☻ ",end="")
        print("")

    next_player = 1 if player == 2 else 2
    possible_board = possible_moves(board, next_player)
    
    for row in possible_board:
        for x in row:
            if x == True: print("# ",end="")
            if x == False: print("  ",end="")
        print("")

    # Check for a winner
    for row in board:
        if row == [1,1,1,1]:
            print("You win!")
            exit()
