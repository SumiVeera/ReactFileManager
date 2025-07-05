import React from 'react';

const FolderList = ({
  folders,
  onFolderClick,
  handleFileDrop,
  handleDragOver,
  handleDragLeave,
  dragOverId,
  handleFolderDrop,
  setDraggedFolder,
  setDraggedFile,
  layout,
  activeFolder 
}) => {
  return (
  <div className="mt-4">
    {layout === 'grid' ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {folders.map(folder => (
          <div
            key={folder.id}
            className={`p-3 border rounded cursor-pointer 
              ${dragOverId === folder.id ? 'bg-blue-100' : ''}
              ${activeFolder?.id === folder.id ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
            onDoubleClick={() => onFolderClick(folder)}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData('type', 'folder');
              setDraggedFolder(folder);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const systemFiles = e.dataTransfer.files;
              const sourceFolderId = e.dataTransfer.getData('source-folder-id');
              const draggedIndex = e.dataTransfer.getData('file-index');

              if (systemFiles && systemFiles.length > 0) {
                handleFileDrop(e, folder.id);
              } else if (sourceFolderId || draggedIndex) {
                handleFileDrop(e, folder.id);
              } else {
                handleFolderDrop(e, folder.id);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragOver(e, folder.id);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragLeave();
            }}
          >
            <h2 className="text-lg font-semibold mb-1">📁 {folder.name}</h2>
            <ul className="text-sm ml-4">
              {Array.isArray(folder.files) && folder.files.length === 0 ? (
                <li className="text-gray-400">No files</li>
              ) : (
                folder.files.map((file, index) => (
                  <li
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('file-index', index);
                      e.dataTransfer.setData('source-folder-id', folder.id);
                      setDraggedFile(file);
                    }}
                  >
                    📄 {file.name} ({file.size})
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <ul className="space-y-4">
        {folders.map(folder => (
          <li
            key={folder.id}
            className={`p-3 border rounded cursor-pointer 
              ${dragOverId === folder.id ? 'bg-blue-100' : ''}
              ${activeFolder?.id === folder.id ? 'bg-blue-200' :'hover:bg-gray-100'}`}
            onDoubleClick={() => onFolderClick(folder)}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData('type', 'folder');
              setDraggedFolder(folder);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const systemFiles = e.dataTransfer.files;
              const sourceFolderId = e.dataTransfer.getData('source-folder-id');
              const draggedIndex = e.dataTransfer.getData('file-index');

              if (systemFiles && systemFiles.length > 0) {
                handleFileDrop(e, folder.id);
              } else if (sourceFolderId || draggedIndex) {
                handleFileDrop(e, folder.id);
              } else {
                handleFolderDrop(e, folder.id);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragOver(e, folder.id);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragLeave();
            }}
          >
            <h2 className="text-lg font-semibold mb-1">📁 {folder.name}</h2>
            <ul className="text-sm ml-4">
              {Array.isArray(folder.files) && folder.files.length === 0 ? (
                <li className="text-gray-400">No files</li>
              ) : (
                folder.files.map((file, index) => (
                  <li
                    key={index}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('file-index', index);
                      e.dataTransfer.setData('source-folder-id', folder.id);
                      setDraggedFile(file);
                    }}
                  >
                    📄 {file.name} ({file.size})
                  </li>
                ))
              )}
            </ul>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}



export default FolderList;

