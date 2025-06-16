import React from 'react';

const FolderList = ({
  folders,
  onFolderClick,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  dragOverId,
}) => {
  return (
    <ul className="space-y-4 mt-4">
      {folders.map(folder => (
        <li
          key={folder.id}
          className={`p-3 border rounded cursor-pointer ${
            dragOverId === folder.id ? 'bg-blue-100' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFolderClick(folder)}
          onDrop={(e) => handleFileDrop(e, folder.id)}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDragLeave={handleDragLeave}
        >
          <h2 className="text-lg font-semibold mb-1">📁 {folder.name}</h2>
          <ul className="text-sm ml-4">
            {folder.files.length === 0 ? (
              <li className="text-gray-400">No files</li>
            ) : (
              folder.files.map((file, index) => (
                <li key={index}>📄 {file.name} ({file.size})</li>
              ))
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default FolderList;








