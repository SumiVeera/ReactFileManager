import React, { useState } from 'react';
import CreateFolder from './components/CreateFolder';
import FolderList from './components/FolderList';

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
    </div>
  );
}

export default App;
