import React from 'react';

function FileList({ files, folders, onMoveFile }) {
  if (files.length === 0) return <p className="text-gray-500">No files uploaded.</p>;

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('fileIndex', index)}
          className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
        >

          <div>
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-500">{file.type || 'Unknown'} • {file.size}</p>
            <p className="text-xs text-gray-400">Folder: {file.folderId ? folders.find(f => f.id.toString() === file.folderId)?.name : 'None'}</p>
          </div>
          <select
            className="border rounded px-2 py-1"
            value={file.folderId || ''}
            onChange={(e) => onMoveFile(index, e.target.value)}
          >
            <option value="">No Folder</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default FileList;

