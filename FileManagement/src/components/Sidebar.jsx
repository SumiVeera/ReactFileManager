import React from 'react';
import FolderItem from './FolderItem';

function Sidebar({
  folders, newFolderName, setNewFolderName, handleAddFolder,
  editingId, setEditingId, editedName, setEditedName,
  handleRename, handleDelete, setActiveFolder, setRootFiles
}) {
  return (
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
          <FolderItem
            key={folder.id}
            folder={folder}
            editingId={editingId}
            setEditingId={setEditingId}
            editedName={editedName}
            setEditedName={setEditedName}
            handleRename={handleRename}
            handleDelete={handleDelete}
            setActiveFolder={setActiveFolder}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
