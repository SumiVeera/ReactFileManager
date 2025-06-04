import React from 'react';

function FileUploader({ onFilesUploaded }) {
  const handleFiles = (fileList) => {
    const files = Array.from(fileList).map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(2) + ' KB',
      folderId: null,
    }));
    onFilesUploaded(files);
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
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-blue-400 p-6 text-center rounded cursor-pointer hover:bg-blue-50 mb-6"
    >
      <p className="text-gray-600 mb-2">Drag & drop files here, or select manually</p>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
