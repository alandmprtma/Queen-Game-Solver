from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import deque

app = Flask(__name__)
CORS(app)

@app.route('/solve', methods=['POST'])
def solve():
    # Ambil data dari JSON request
    data = request.get_json()
    algorithm = data['algorithm']
    file_content = data['fileContent']

    print('File Content:', file_content)
    print('Algorithm:', algorithm)

    board, regions = process_file(file_content)
    solution = solve_board(board, regions, algorithm)
    
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

def solve_board(board, regions, algorithm):
    n = len(board)
    
    if algorithm == 'BFS':
        return bfs(board, regions)
    elif algorithm == 'DFS':
        return dfs(board, regions)
    else:
        return board # Default fallback

def bfs(board, regions):
    n = len(board)
    queue = deque([([], {r: False for r in regions})])  # (current_queens, regions_status)

    while queue:
        queens, regions_status = queue.popleft()

        if len(queens) == len(regions):
            return place_queens(board, queens)

        row = len(queens)
        for col in range(n):
            print(queens)
            if is_safe(queens, row, col):
                region = board[row][col]
                if not regions_status[region]:
                    new_regions_status = regions_status.copy()
                    new_regions_status[region] = True
                    queue.append((queens + [(row, col)], new_regions_status))
    
    return None



def dfs(board, regions):
    # Sort regions by the number of available cells in descending order
    sorted_regions = sorted(regions.items(), key=lambda x: len(x[1]), reverse=True)
    return dfs_helper(board, sorted_regions, [], {r: False for r in regions}, 0)

def dfs_helper(board, sorted_regions, queens, regions_status, region_index):
    if len(queens) == len(regions_status):
        # Ketika semua ratu sudah ditempatkan, kembalikan solusi
        return place_queens(board, queens)

    if region_index >= len(sorted_regions):
        # Jika mencapai akhir tanpa menempatkan semua ratu, mundur (backtrack)
        return None

    region, cells = sorted_regions[region_index]

    for row, col in cells:
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

    # Jika tidak ada posisi yang valid di wilayah ini, mundur (backtrack) ke wilayah sebelumnya
    print(f"Backtracking from region {region} (index {region_index}), queens: {queens}")
    return None

def is_safe(queens, row, col):
    for r, c in queens:
        # Pastikan tidak ada ratu yang bertabrakan dalam kolom, diagonal kanan atau kiri
        if c == col or r == row or (r - 1 == row and c-1 == col) or (r+1 == row and c-1 == col) or (r+1 == row and c+1 == col) or (r-1 == row and c+1 == col):
            return False
    return True


def place_queens(board, queens):
    result = [row[:] for row in board]  # Copy the board's original structure
    for r, c in queens:
        result[r][c] = 'Q'
    return result


if __name__ == '__main__':
    app.run(debug=True)
