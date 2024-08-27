"use client"
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import BoardDisplay from '../components/BoardDisplay';

export default function Home() {
  const [file, setFile] = useState(null);
  const [board, setBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [algorithm, setAlgorithm] = useState('BFS'); // Default to BFS
  const [fileContent, setFileContent] = useState('');


  
  // Handle file upload and parsing
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
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

  // Handle submission and backend interaction
  const handleSubmit = async () => {
    if (!fileContent) {
      alert("Please upload a file first");
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent, algorithm }),
      });
  
      const data = await response.json();
      console.log(data.board);
  
      // Salinan papan saat ini untuk diupdate
      const updatedBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => {
          // Jika posisi ini memiliki Q pada hasil dari backend, tambahkan Q di sini
          if (data.board[rowIndex][colIndex] === 'Q') {
            return 'Q'; // Update dengan Q pada posisi yang diberikan
          }
          return cell; // Pertahankan sel lain seperti semula
        })
      );
      
      setSolutionBoard(updatedBoard);
  
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
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
          className="p-2 border rounded"
        >
          <option value="BFS">BFS</option>
          <option value="DFS">DFS</option>
        </select>
      </div>
      <button 
        onClick={handleSubmit} 
        className="mt-4 p-2 bg-blue-500 w-[150px] text-white rounded"
      >
        Submit
      </button>
      <BoardDisplay board={board} solutionBoard={solutionBoard}/>
      <div className='pt-[50px]'></div>
      </div>
    </div>
  );
}
