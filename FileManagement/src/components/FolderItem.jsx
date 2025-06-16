import React from 'react';

function FolderItem({
  folder, editingId, setEditingId, editedName, setEditedName,
  handleRename, handleDelete, setActiveFolder
}) {
  return (
    <li className="mb-2 flex justify-between items-center">
      {editingId === folder.id ? (
        <>
          <input
            className="flex-1 border px-2 py-1 text-sm"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <button className="ml-2 text-green-600" onClick={() => handleRename(folder.id)}>✅</button>
          <button className="ml-1 text-red-500" onClick={() => setEditingId(null)}>❌</button>
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
            >✏️</button>
            <button
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(folder.id);
              }}
            >🗑️</button>
          </div>
        </div>
      )}
    </li>
  );
}

export default FolderItem;
