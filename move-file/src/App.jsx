import React, { useState } from 'react';
import CreateFolder from './components/CreateFolder';
import FolderList from './components/FolderList';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList'; 


function App() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const addFolder = (name) => {
    if (name.trim() !== "") {
      setFolders([...folders, { id: Date.now().toString(), name }]);
    }
  };
  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const moveFile = (fileIndex, folderId) => {
  setFiles(prevFiles => 
    prevFiles.map((file, idx) => 
      idx === fileIndex ? { ...file, folderId: folderId || null } : file
    )
  );
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>📁 React File Manager</h1>
      <CreateFolder onAdd={addFolder} />
      <FolderList folders={folders} />
      <h2 className="text-xl font-semibold mt-8 mb-4">📄 Upload Files</h2>
      <FileUploader onFilesUploaded={addFiles}/>
      <h2 className="text-xl font-semibold mt-8 mb-4">📦 All Files</h2>
      <FileList files={files} folders={folders} onMoveFile={moveFile} />
    </div>
  );
}

export default App;
