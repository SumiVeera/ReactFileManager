import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useFolderManager() {
  const [folders, setFolders] = useState([
    { id: '1', name: 'NDA', files: [] },
    { id: '2', name: 'Sales', files: [] },
    { id: '3', name: 'Marketing', files: [] },
  ]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [rootFiles, setRootFiles] = useState([]);
  const [dragOverId, setDragOverId] = useState(null);

  const handleAddFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const duplicate = folders.some(folder => folder.name.toLowerCase() === name.toLowerCase());
    if (duplicate) return alert('Folder with this name already exists!');
    setFolders([...folders, { id: uuidv4(), name, files: [] }]);
    setNewFolderName('');
  };

  const handleRename = (id) => {
    setFolders(folders.map(folder =>
      folder.id === id ? { ...folder, name: editedName } : folder
    ));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const folder = folders.find(f => f.id === id);
    if (folder.files.length > 0 && !window.confirm(`Folder "${folder.name}" contains files. Delete anyway?`)) {
      return;
    }
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const handleFileDrop = (e, folderId) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('file-index');

    if (draggedIndex !== '') {
      const fileToMove = rootFiles[draggedIndex];
      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? { ...folder, files: [...folder.files, fileToMove] }
            : folder
        )
      );
      setRootFiles(prev => prev.filter((_, i) => i !== Number(draggedIndex)));
    } else {
      const droppedFiles = e.dataTransfer.files;
      const fileArray = Array.from(droppedFiles).map(file => ({
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(2) + ' KB',
      }));
      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? { ...folder, files: [...folder.files, ...fileArray] }
            : folder
        )
      );
    }
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  return {
    folders, setFolders, newFolderName, setNewFolderName, editingId, setEditingId,
    editedName, setEditedName, activeFolder, setActiveFolder,
    rootFiles, setRootFiles, dragOverId, setDragOverId,
    handleAddFolder, handleRename, handleDelete, handleFileDrop, handleDragOver,
    handleDragLeave
  };
}
