import React, { useState } from 'react';

function FileUploader() {
  const [files, setFiles] = useState([]);

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles).map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(2) + ' KB',
    }));
    setFiles(prev => [...prev, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-blue-400 p-6 text-center rounded-md mb-6 cursor-pointer hover:bg-blue-50"
      >
        <p className="text-gray-600">Drag and drop files here, or click to select</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-2"
        />
      </div>

      <div className="grid gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-4 border rounded-md shadow-sm bg-white"
          >
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-600">Type: {file.type || 'Unknown'}</p>
            <p className="text-sm text-gray-600">Size: {file.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUploader;
