import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FolderList from './components/FolderList';

function App() {
  const [folders, setFolders] = useState([
    { id: '1', name: 'NDA', files: [] },
    { id: '2', name: 'Sales', files: [] },
    { id: '3', name: 'Marketing', files: [] },
  ]);
  const [newFolderName, setNewFolderName] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [rootFiles, setRootFiles] = useState([]);

  const handleAddFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const duplicate = folders.some(
      folder => folder.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      alert("Folder with this name already exists!");
      return;
    }
    setFolders([...folders, { id: uuidv4(), name, files: [] }]);
    setNewFolderName('');
  };

  const handleRename = (id) => {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, name: editedName } : folder
    ));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const folder = folders.find(f => f.id === id);
    if (folder.files.length > 0) {
      const confirmDelete = window.confirm(
        `Folder "${folder.name}" contains files. Delete anyway?`
      );
      if (!confirmDelete) return;
    }
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const handleFileDrop = (e, folderId) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('file-index');

    if (draggedIndex !== '') {
      const fileToMove = rootFiles[draggedIndex];
      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? { ...folder, files: [...folder.files, fileToMove] }
            : folder
        )
      );
      setRootFiles(prev => prev.filter((_, i) => i !== Number(draggedIndex)));
      return;
    }

    const droppedFiles = e.dataTransfer.files;
    const fileArray = Array.from(droppedFiles).map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(2) + ' KB',
    }));

    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, files: [...folder.files, ...fileArray] }
          : folder
      )
    );
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <input
          id="root-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const uploaded = Array.from(e.target.files).map(file => ({
              name: file.name,
              type: file.type,
              size: (file.size / 1024).toFixed(2) + ' KB',
            }));
            setRootFiles(prev => [...prev, ...uploaded]);
          }}
        />

        <button
          onClick={() => document.getElementById('root-upload').click()}
          className="w-full mb-4 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          ⬆️ Upload
        </button>

        <h2 className="text-lg font-bold mb-4">📁 Folders</h2>

        <div className="mb-4 flex">
          <input
            className="flex-1 border px-2 py-1 rounded text-sm"
            type="text"
            placeholder="New folder"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button
            onClick={handleAddFolder}
            className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul>
          {folders.map(folder => (
            <li key={folder.id} className="mb-2 flex justify-between items-center">
              {editingId === folder.id ? (
                <>
                  <input
                    className="flex-1 border px-2 py-1 text-sm"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <button
                    className="ml-2 text-green-600"
                    onClick={() => handleRename(folder.id)}
                  >
                    ✅
                  </button>
                  <button
                    className="ml-1 text-red-500"
                    onClick={() => setEditingId(null)}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <div
                  className="flex-1 flex justify-between items-center cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
                  onClick={() => setActiveFolder(folder)}
                >
                  <span>{folder.name}</span>
                  <div className="space-x-1 text-sm">
                    <button
                      className="text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(folder.id);
                        setEditedName(folder.name);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
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

            {/* Upload files to this folder */}
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
                  <li key={index} className="text-sm">
                    📄 {file.name} ({file.size})
                  </li>
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
                      onDragStart={(e) => {
                        e.dataTransfer.setData('file-index', index);
                      }}
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
    </div>
  );
}

export default App;
