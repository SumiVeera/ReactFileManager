import React, { useState } from 'react';

function FolderItem({
  folder,
  editingId,
  setEditingId,
  editedName,
  setEditedName,
  handleRename,
  handleDelete,
  setActiveFolder,
  handleAddSubfolder,
  handleSetActiveFolder,
  handleFolderDrop,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  dragOverId,
  setDraggedFolder,
}) {
  const [expanded, setExpanded] = useState(true);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subName, setSubName] = useState('');

  const handleExpandToggle = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <li
      className={`mb-2 ${dragOverId === folder.id ? 'bg-blue-100' : ''}`}
      onDrop={(e) => handleFolderDrop(e, folder.id)}
      onDragOver={(e) => handleDragOver(e, folder.id)}
      onDragLeave={handleDragLeave}
      onDragStart={(e) => {
        e.stopPropagation();
        setDraggedFolder(folder);
      }}
      draggable
    >
      <div
        className="flex items-center justify-between hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
        onClick={() => handleSetActiveFolder(folder.id)}
      >
        <div className="flex items-center space-x-1">
          {folder.subfolders?.length > 0 && (
            <button onClick={handleExpandToggle} className="text-xs w-4">
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <span className="font-medium">
            {editingId === folder.id ? (
              <input
                className="border px-1 py-0.5 text-sm"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            ) : (
              folder.name
            )}
          </span>
        </div>

        <div className="space-x-1 text-sm">
          {editingId === folder.id ? (
            <>
              <button
                className="text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(folder.id);
                }}
              >
                ✅
              </button>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(null);
                }}
              >
                ❌
              </button>
            </>
          ) : (
            <>
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
              <button
                className="text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingSub(true);
                }}
              >
                ➕
              </button>
            </>
          )}
        </div>
      </div>

      {/* Subfolder Add Input */}
      {isAddingSub && (
        <div className="ml-6 mt-1 flex items-center">
          <input
            className="border px-2 py-0.5 text-sm rounded mr-2"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="Subfolder name"
            autoFocus
          />
          <button
            className="text-green-600 text-sm"
            onClick={() => {
              if (subName.trim()) {
                handleAddSubfolder(folder.id, subName.trim());
                setSubName('');
                setIsAddingSub(false);
              }
            }}
          >
            ✅
          </button>
          <button
            className="text-red-500 text-sm ml-1"
            onClick={() => {
              setIsAddingSub(false);
              setSubName('');
            }}
          >
            ❌
          </button>
        </div>
      )}

      {/* Recursive Subfolders */}
      {expanded && folder.subfolders?.length > 0 && (
        <ul className="ml-6 mt-1 border-l border-gray-300 pl-2">
          {folder.subfolders.map((sub) => (
            <FolderItem
              key={sub.id}
              folder={sub}
              editingId={editingId}
              setEditingId={setEditingId}
              editedName={editedName}
              setEditedName={setEditedName}
              handleRename={handleRename}
              handleDelete={handleDelete}
              setActiveFolder={setActiveFolder}
              handleAddSubfolder={handleAddSubfolder}
              handleSetActiveFolder={handleSetActiveFolder}
              handleFolderDrop={handleFolderDrop}
              handleFileDrop={handleFileDrop}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              dragOverId={dragOverId}
              setDraggedFolder={setDraggedFolder}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default FolderItem;
