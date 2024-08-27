import { useState } from 'react';

export default function FileUpload({ handleFileChange }) {

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (file) {
//       onFileUpload(file);
//     }
//   };

  return (
    <input
    type="file"
    accept=".txt"
    onChange={handleFileChange}
    className="mb-4 mt-3"
  />
  );
}
