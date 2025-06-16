import React from 'react';
import FolderList from './FolderList';

function MainContent({
  activeFolder, setActiveFolder, folders,
  setFolders, rootFiles, setRootFiles,
  handleFileDrop, handleDragOver, dragOverId, handleDragLeave
}) {
  return (
    <div className="flex-1 p-6">
      {activeFolder ? (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">📁 {activeFolder.name}</h1>
            <button
              className="px-4 py-1 bg-gray-300 rounded"
              onClick={() => setActiveFolder(null)}
            >
              🔙 Back to all folders
            </button>
          </div>
          <div className="mt-4">
            <input
              type="file"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files).map(file => ({
                  name: file.name,
                  size: (file.size / 1024).toFixed(2) + ' KB',
                  type: file.type,
                }));
                setFolders(prev =>
                  prev.map(folder =>
                    folder.id === activeFolder.id
                      ? { ...folder, files: [...folder.files, ...newFiles] }
                      : folder
                  )
                );
                setActiveFolder(prev => ({
                  ...prev,
                  files: [...prev.files, ...newFiles],
                }));
              }}
            />
          </div>
          <ul className="mt-4 space-y-2">
            {activeFolder.files.length === 0 ? (
              <li className="text-gray-500">No files yet.</li>
            ) : (
              activeFolder.files.map((file, index) => (
                <li key={index} className="text-sm">📄 {file.name} ({file.size})</li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold">Welcome to File Management</h1>
          <p className="text-gray-600 mt-2">Select a folder to view files.</p>
          <FolderList
            folders={folders}
            onFolderClick={(folder) => setActiveFolder(folder)}
            handleFileDrop={handleFileDrop}
            handleDragOver={handleDragOver}
            dragOverId={dragOverId}
            handleDragLeave={handleDragLeave}
          />
          {rootFiles.length > 0 && (
            <div className="mt-6">
              <ul className="space-y-2 text-sm">
                {rootFiles.map((file, index) => (
                  <li
                    key={index}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('file-index', index)}
                    className="bg-white border p-2 rounded shadow cursor-move"
                  >
                    📄 {file.name} ({file.size})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MainContent;
