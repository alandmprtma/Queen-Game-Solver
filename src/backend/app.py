from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import deque
import random
import math

app = Flask(__name__)
CORS(app)

@app.route('/solve', methods=['POST'])
def solve():
    # Ambil data dari JSON request
    data = request.get_json()
    algorithm = data['algorithm']
    file_content = data['fileContent']
    chessPiece = data['chessPiece']

    print('File Content:', file_content)
    print('Algorithm:', algorithm)

    board, regions = process_file(file_content)
    solution = solve_board(board, regions, algorithm, chessPiece)
    
    return jsonify({'board': solution})

def process_file(file_content):
    # Split the string into lines
    lines = file_content.splitlines()
    
    # Assuming the first line contains the board size
    size = tuple(map(int, lines[0].strip().split()))
    
    # The number of regions
    num_regions = int(lines[1].strip())
    
    # The remaining lines represent the board
    board = [line.strip().split() for line in lines[2:]]
    
    # Identify regions
    regions = extract_regions(board, num_regions)
    
    return board, regions

def extract_regions(board, num_regions):
    regions = {}
    for r in range(len(board)):
        for c in range(len(board[0])):
            region = board[r][c]
            if region not in regions:
                regions[region] = []
            regions[region].append((r, c))
    return regions

def solve_board(board, regions, algorithm, chessPiece):
    n = len(board)
    
    if algorithm == 'BFS':
        return bfs(board, regions, chessPiece)
    elif algorithm == 'DFS':
        return dfs(board, regions, chessPiece)
    else:
        return board # Default fallback

def bfs(board, regions, chessPiece):
    n = len(board)
    queue = deque([([], {r: False for r in regions})])  # (current_queens, regions_status)

    while queue:
        queens, regions_status = queue.popleft()

        if len(queens) == len(regions):
            return place_piece(board, queens, chessPiece)

        row = len(queens)
        for col in range(n):
            print(queens)
            if(chessPiece == 'Q'):
                if is_safe(queens, row, col):
                    region = board[row][col]
                    if not regions_status[region]:
                        new_regions_status = regions_status.copy()
                        new_regions_status[region] = True
                        queue.append((queens + [(row, col)], new_regions_status))
            elif(chessPiece == 'R'):
                 if is_safe_rook(queens, row, col):
                    region = board[row][col]
                    if not regions_status[region]:
                        new_regions_status = regions_status.copy()
                        new_regions_status[region] = True
                        queue.append((queens + [(row, col)], new_regions_status))
            elif(chessPiece == 'K'):
                 if is_safe_knight(queens, row, col):
                    region = board[row][col]
                    if not regions_status[region]:
                        new_regions_status = regions_status.copy()
                        new_regions_status[region] = True
                        queue.append((queens + [(row, col)], new_regions_status))
            elif(chessPiece == 'B'):
                 if is_safe_bishop(queens, row, col):
                    region = board[row][col]
                    if not regions_status[region]:
                        new_regions_status = regions_status.copy()
                        new_regions_status[region] = True
                        queue.append((queens + [(row, col)], new_regions_status))
            elif(chessPiece == "QS"):
                 if is_safe_queen(queens, row, col):
                    region = board[row][col]
                    if not regions_status[region]:
                        new_regions_status = regions_status.copy()
                        new_regions_status[region] = True
                        queue.append((queens + [(row, col)], new_regions_status))
    
    
    return None



def dfs(board, regions, chessPiece):
    # Sort regions by the number of available cells in descending order
    sorted_regions = sorted(regions.items(), key=lambda x: len(x[1]), reverse=True)
    return dfs_helper(board, sorted_regions, [], {r: False for r in regions}, 0, chessPiece)

def dfs_helper(board, sorted_regions, queens, regions_status, region_index, chessPiece):
    if len(queens) == len(regions_status):
        # Ketika semua ratu sudah ditempatkan, kembalikan solusi
        return place_piece(board, queens)

    if region_index >= len(sorted_regions):
        # Jika mencapai akhir tanpa menempatkan semua ratu, mundur (backtrack)
        return None

    region, cells = sorted_regions[region_index]

    for row, col in cells:
        if(chessPiece == 'Q'):
            if is_safe(queens, row, col):
                if not regions_status[region]:  # Pastikan wilayah ini belum ditempati oleh ratu
                    new_queens = queens + [(row, col)]
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    print(f"Placing queen at {row}, {col} in region {region}")
                    result = dfs_helper(board, sorted_regions, new_queens, new_regions_status, region_index + 1)
                    if result:
                        return result
            else:
                print(f"Position {row}, {col} in region {region} is not safe for placing queen.")
        elif(chessPiece == 'K'):
            if is_safe_knight(queens, row, col):
                if not regions_status[region]:  # Pastikan wilayah ini belum ditempati oleh ratu
                    new_queens = queens + [(row, col)]
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    print(f"Placing queen at {row}, {col} in region {region}")
                    result = dfs_helper(board, sorted_regions, new_queens, new_regions_status, region_index + 1)
                    if result:
                        return result
            else:
                print(f"Position {row}, {col} in region {region} is not safe for placing queen.")
        elif(chessPiece == 'R'):
            if is_safe_rook(queens, row, col):
                if not regions_status[region]:  # Pastikan wilayah ini belum ditempati oleh benteng
                    new_queens = queens + [(row, col)]
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    print(f"Placing queen at {row}, {col} in region {region}")
                    result = dfs_helper(board, sorted_regions, new_queens, new_regions_status, region_index + 1)
                    if result:
                        return result
            else:
                print(f"Position {row}, {col} in region {region} is not safe for placing queen.")
        elif(chessPiece == 'B'):
            if is_safe_bishop(queens, row, col):
                if not regions_status[region]:  # Pastikan wilayah ini belum ditempati oleh bishop
                    new_queens = queens + [(row, col)]
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    print(f"Placing bishop at {row}, {col} in region {region}")
                    result = dfs_helper(board, sorted_regions, new_queens, new_regions_status, region_index + 1)
                    if result:
                        return result
            else:
                print(f"Position {row}, {col} in region {region} is not safe for placing bishop.")
        elif(chessPiece == 'QS'):
            if is_safe_queen(queens, row, col):
                if not regions_status[region]:  # Pastikan wilayah ini belum ditempati oleh ratu standar catur
                    new_queens = queens + [(row, col)]
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    print(f"Placing bishop at {row}, {col} in region {region}")
                    result = dfs_helper(board, sorted_regions, new_queens, new_regions_status, region_index + 1)
                    if result:
                        return result
            else:
                print(f"Position {row}, {col} in region {region} is not safe for placing bishop.")

        

    # Jika tidak ada posisi yang valid di wilayah ini, mundur (backtrack) ke wilayah sebelumnya
    print(f"Backtracking from region {region} (index {region_index}), queens: {queens}")
    return None

def is_safe(queens, row, col):
    for r, c in queens:
        # Pastikan tidak ada ratu yang bertabrakan dalam kolom, diagonal kanan atau kiri
        if c == col or r == row or (r - 1 == row and c-1 == col) or (r+1 == row and c-1 == col) or (r+1 == row and c+1 == col) or (r-1 == row and c+1 == col):
            return False
    return True

def is_safe_queen(queens, row, col):
    for r, c in queens:
        # Pastikan tidak ada ratu yang bertabrakan dalam kolom, baris, atau diagonal
        if c == col or r == row or abs(r - row) == abs(c - col):
            return False
    return True

def is_safe_rook(rook_positions, row, col):
    for r, c in rook_positions:
        if r == row or c == col:
            return False
    return True

def is_safe_knight(knight_positions, row, col):
    knight_moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]
    for r, c in knight_positions:
        for move in knight_moves:
            if (r + move[0] == row) and (c + move[1] == col):
                return False
    return True

def is_safe_bishop(bishop_positions, row, col):
    for r, c in bishop_positions:
        if abs(r - row) == abs(c - col):
            return False
    return True



def place_piece(board, queens, chessPiece):
    result = [row[:] for row in board]  # Copy the board's original structure
    if (chessPiece == 'Q'):
        for r, c in queens:
            result[r][c] = 'Q'
    elif (chessPiece == 'R'):
        for r, c in queens:
            result[r][c] = 'R'
    elif (chessPiece == 'K'):
        for r, c in queens:
            result[r][c] = 'K'
    elif(chessPiece == 'B'):
        for r, c in queens:
            result[r][c] = 'B'
    elif(chessPiece == 'QS'):
        for r, c in queens:
            result[r][c] = 'QS'
    return result


if __name__ == '__main__':
    app.run(debug=True)
