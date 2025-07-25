import React from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import useFolderManager from './hooks/useFolderManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const folderManager = useFolderManager();

  return (
    <div className="flex h-screen">
      <Sidebar {...folderManager} />
      <MainContent {...folderManager} />
      <ToastContainer position="bottom-right" />
  
    </div>
  );
}

export default App;






















