import React, { useState } from 'react';
import CreateFolder from './components/CreateFolder';
import FolderList from './components/FolderList';
import FileUploader from './components/FileUploader'; 


function App() {
  const [folders, setFolders] = useState([]);

  const addFolder = (name) => {
    if (name.trim() !== "") {
      setFolders([...folders, { id: Date.now(), name }]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📁 React File Manager</h1>
      <CreateFolder onAdd={addFolder} />
      <FolderList folders={folders} />
      <h2 className="text-xl font-semibold mt-8 mb-4">📄 Upload Files</h2>
      <FileUploader />
    </div>
  );
}

export default App;
