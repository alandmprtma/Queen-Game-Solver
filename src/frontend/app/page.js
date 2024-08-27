"use client"
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import BoardDisplay from '../components/BoardDisplay';
import BeatLoader from "react-spinners/BeatLoader";

export default function Home() {
  const [inputMode, setInputMode] = useState('file'); // Default to file input
  const [file, setFile] = useState(null);
  const [board, setBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [algorithm, setAlgorithm] = useState('BFS');
  const [chessPiece, setChessPiece] = useState('Q');
  const [fileContent, setFileContent] = useState('');
  const [manualBoard, setManualBoard] = useState([]); // For manual input
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [region, setRegion] = useState();
  const [loading, setLoading] = useState(false);

  // Handle file upload and parsing
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    setFile(file);
    setSolutionBoard([]); // Reset solution board when a new file is uploaded 
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      console.log(content);

      const lines = content.trim().split('\n');
      const boardData = lines.slice(2).map(row => row.split(' ')); // Skip first two lines
      setBoard(boardData);
    };

    reader.readAsText(file);
  };

  // Handle manual board input change
  const handleManualInputChange = (rowIndex, colIndex, value) => {
    const updatedBoard = [...manualBoard];
    updatedBoard[rowIndex][colIndex] = value;
    setManualBoard(updatedBoard);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleChessPieceChange = (e) => {
    setChessPiece(e.target.value);
  };

  const handleInputModeChange = (e) => {
    setInputMode(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    let boardToSubmit = '';
  if (inputMode === 'file') {
    boardToSubmit = fileContent;
  } else {
    // Construct the manualBoard string
    let dimensions = `${rows} ${cols}`; // e.g., "4 5"
    let regionsCount = region.toString(); // e.g., "3"
    let boardString = manualBoard.map(row => row.join(' ')).join('\n'); // Board rows
    
    // Combine them into the required format
    boardToSubmit = `${dimensions}\n${regionsCount}\n${boardString}`;
    console.log(boardToSubmit)
    const lines = boardToSubmit.trim().split('\n');
    const boardData = lines.slice(2).map(row => row.split(' ')); // Skip first two lines
    setBoard(boardData);
  }

    
    try {
      const response = await fetch('http://127.0.0.1:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent: boardToSubmit, algorithm, chessPiece }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      console.log(data.board);

      if (data.board === null) {
        alert("Solution Not Found");
      } else {
        const updatedBoard = board.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => {
            if (data.board[rowIndex][colIndex] === 'Q') return 'Q';
            if (data.board[rowIndex][colIndex] === 'R') return 'R';
            if (data.board[rowIndex][colIndex] === 'K') return 'K';
            if (data.board[rowIndex][colIndex] === 'B') return 'B';
            if (data.board[rowIndex][colIndex] === 'QS') return 'QS';
            return cell;
          })
        );
        setSolutionBoard(updatedBoard);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Solution Not Found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#6a1b9a] min-h-screen w-screen">
      <img src="/Queens-Game-Logo.png" alt="Logo" className="ml-12 mb-8 w-24 h-24"/>
      <div className='flex flex-col items-center'>
        <h1 className="text-4xl font-bold mb-8">Queens Game Solver</h1>
        
        <div className="mb-4">
          <label htmlFor="inputMode" className="mr-2">Input Mode:</label>
          <select
            id="inputMode"
            value={inputMode}
            onChange={handleInputModeChange}
            className="p-2 border rounded text-black font-bold"
          >
            <option value="file">Upload File</option>
            <option value="manual">Manual Input</option>
          </select>
        </div>
        
        {inputMode === 'file' ? (
          <FileUpload handleFileChange={handleFileChange} />
        ) : (
          <div className="mb-4">
            <div className="mb-2">
              <label>Rows: </label>
              <input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} className="p-1 border rounded text-black"/>
              <label className="ml-4">Cols: </label>
              <input type="number" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} className="p-1 border rounded text-black"/>
              <button onClick={() => setManualBoard(Array(rows).fill().map(() => Array(cols).fill('')))} className="ml-4 p-2 bg-blue-500 text-white rounded">Generate Board</button>
            </div>
            <div className='flex justify-center'>
            <label className='mr-2'>Region:</label>
            <input type="number" value={region} onChange={(e) => setRegion(parseInt(e.target.value))} className="p-1 mb-4 border rounded text-black"/>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {manualBoard.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <input 
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    maxLength={1}
                    value={cell}
                    onChange={(e) => handleManualInputChange(rowIndex, colIndex, e.target.value)}
                    className="w-[40px] h-[40px] border text-center text-black"
                  />
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="algorithm" className="mr-2">Select Algorithm:</label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={handleAlgorithmChange}
            className="p-2 border rounded text-black font-bold"
          >
            <option value="BFS">BFS</option>
            <option value="DFS">DFS</option>
          </select>
          <label htmlFor="chessPiece" className="mr-2 ml-6">Select Chess Piece:</label>
          <select
            id="chessPiece"
            value={chessPiece}
            onChange={handleChessPieceChange}
            className="p-2 border rounded text-black font-bold"
          >
            <option value="Q">Queen</option>
            <option value="QS">Q Standard</option>
            <option value="R">Rook</option>
            <option value="B">Bishop</option>
            <option value="K">Knight</option>
          </select>
        </div>
        
        {loading ? (
          <div className="mt-4">
            <BeatLoader color={"#ffffff"} loading={loading} size={15} />
          </div>
        ) : (
          <button 
            onClick={handleSubmit} 
            className="mt-4 p-2 bg-blue-500 w-[150px] text-white rounded"
          >
            Submit
          </button>
        )}

        <BoardDisplay board={board} solutionBoard={solutionBoard}/>
        <div className='pt-[50px]'></div>
      </div>
    </div>
  );
}
