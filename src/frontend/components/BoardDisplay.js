import { useMemo } from 'react';

export default function BoardDisplay({ board, solutionBoard }) {
  if (!board || board.length === 0) return null;

  const numCols = board[0].length; // Calculate the number of columns

  // Extended array of Tailwind color classes
  const colors = [
    'bg-yellow-200', 'bg-red-200', 'bg-blue-200', 'bg-green-200', 
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-gray-200', 
    'bg-orange-200', 'bg-teal-200', 'bg-lime-200', 'bg-yellow-300', 
    'bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-purple-300', 
    'bg-pink-300', 'bg-indigo-300', 'bg-gray-300', 'bg-orange-300', 
    'bg-teal-300', 'bg-lime-300', 'bg-yellow-400', 'bg-red-400', 
    'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 
    'bg-indigo-400', 'bg-gray-400', 'bg-orange-400', 'bg-teal-400', 
    'bg-lime-400', 'bg-yellow-500', 'bg-red-500', 'bg-blue-500', 
    'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 
    'bg-gray-500', 'bg-orange-500', 'bg-teal-500', 'bg-lime-500'
  ];

  // Function to generate a unique color for each symbol
  const generateColorClass = (symbol) => {
    const symbolIndex = symbol.charCodeAt(0) % colors.length;
    return colors[symbolIndex];
  };

  // Memoize the color map to avoid re-calculating on every render
  const colorMap = useMemo(() => {
    const map = {};
    board.flat().forEach(cell => {
      if (!map[cell]) {
        map[cell] = generateColorClass(cell);
      }
    });
    return map;
  }, [board]);

  return (
    <div
      className="grid gap-1 mt-[40px]"
      style={{
        gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
      }}
    >
      {board.flat().map((cell, index) => {
        const rowIndex = Math.floor(index / numCols);
        const colIndex = index % numCols;

        // Check if solutionBoard exists and has the correct structure
        const solutionCell = solutionBoard && solutionBoard[rowIndex] ? solutionBoard[rowIndex][colIndex] : null;

        return (
          <div
            key={index}
            className={`p-4 w-[65px] h-[65px] border ${colorMap[cell]} text-black font-bold flex flex-col text-center justify-center`}
          >
            {solutionCell === 'Q' ? 'Q' : ''}
          </div>
        );
      })}
    </div>
  );
}
