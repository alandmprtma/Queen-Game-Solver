"use client"
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import BoardDisplay from '../components/BoardDisplay';
import BeatLoader from "react-spinners/BeatLoader";

export default function Home() {
  const [file, setFile] = useState(null);
  const [board, setBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [algorithm, setAlgorithm] = useState('BFS'); // Default to BFS
  const [chessPiece, setChessPiece] = useState('Q');
  const [fileContent, setFileContent] = useState('');
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

      // Parse file content and create the initial board
      const lines = content.trim().split('\n');
      const boardData = lines.slice(2).map(row => row.split(' ')); // Skip first two lines
      setBoard(boardData);
    };

    reader.readAsText(file);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleChessPieceChange = (e) => {
    setChessPiece(e.target.value);
  }

  // Handle submission and backend interaction
  const handleSubmit = async () => {
    if (!fileContent) {
      alert("Please upload a file first");
      return;
    }
  
    setLoading(true); // Set loading to true when starting the request
    
    try {
      const response = await fetch('http://127.0.0.1:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent, algorithm, chessPiece }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to get response from server"); // Handle non-2xx HTTP codes
      }
  
      const data = await response.json();
      console.log(data.board);
      // Salinan papan saat ini untuk diupdate
      const updatedBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => {
          // Jika posisi ini memiliki Q pada hasil dari backend, tambahkan Q di sini
          if (data.board[rowIndex][colIndex] === 'Q') {
            return 'Q'; // Update dengan Q pada posisi yang diberikan
          }
          else if (data.board[rowIndex][colIndex] === 'R'){
            return 'R';
          }
          else if (data.board[rowIndex][colIndex] === 'K'){
            return 'K';
          }
          else if (data.board[rowIndex][colIndex] === 'B'){
            return 'B';
          }
          else if (data.board[rowIndex][colIndex] === 'QS'){
            return 'QS';
          }
          return cell; // Pertahankan sel lain seperti semula
        })
      
      );

      setSolutionBoard(updatedBoard);
        

    } catch (error) {
      console.error("Error:", error);
      alert("Solution Not Found");
    } finally {
      setLoading(false); // Set loading to false after the request is complete, regardless of success or failure
    }
  };


  return (
    <div className=" bg-[#6a1b9a] min-h-screen w-screen ">
      <img src="/Queens-Game-Logo.png" alt="Logo" className="ml-12 mb-8 w-24 h-24"/>
      <div className='flex flex-col items-center'>
      <h1 className="text-4xl font-bold mb-8">
          Queens Game Solver
        </h1>
      <FileUpload handleFileChange={handleFileChange} />
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
          id="algorithm"
          value={chessPiece}
          onChange={handleChessPieceChange}
          className="p-2 border rounded text-black font-bold"
        >
          <option value="Q">Q</option>
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
