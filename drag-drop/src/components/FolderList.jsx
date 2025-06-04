import React, { useState } from 'react';

function FolderList({ folders, onDropFileToFolder }) {
  const [dragOverId, setDragOverId] = useState(null);

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDrop = (e, folderId) => {
    const fileIndex = e.dataTransfer.getData('fileIndex');
    onDropFileToFolder(parseInt(fileIndex), folderId);
    setDragOverId(null);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {folders.map((folder) => (
        <div
          key={folder.id}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDrop={(e) => handleDrop(e, folder.id)}
          onDragLeave={() => setDragOverId(null)}
          className={`border p-4 rounded shadow cursor-pointer text-center ${
            dragOverId === folder.id ? 'bg-blue-100 border-blue-500' : 'bg-white'
          }`}
        >
          📁 {folder.name}
        </div>
      ))}
    </div>
  );
}

export default FolderList;

