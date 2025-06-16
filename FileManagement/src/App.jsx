import React from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import useFolderManager from './hooks/useFolderManager';

function App() {
  const folderManager = useFolderManager();

  return (
    <div className="flex h-screen">
      <Sidebar {...folderManager} />
      <MainContent {...folderManager} />
    </div>
  );
}

export default App;






















