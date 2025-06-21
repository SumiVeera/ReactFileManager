// ✅ useFolderManager.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useFolderManager() {
  const [folders, setFolders] = useState([
    { id: '1', name: 'NDA', files: [], subfolders: [] },
    { id: '2', name: 'Sales', files: [], subfolders: [] },
    { id: '3', name: 'Marketing', files: [], subfolders: [] },
  ]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [rootFiles, setRootFiles] = useState([]);
  const [dragOverId, setDragOverId] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [draggedFolder, setDraggedFolder] = useState(null);

  const handleAddFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const duplicate = folders.some(folder => folder.name.toLowerCase() === name.toLowerCase());
    if (duplicate) return alert('Folder with this name already exists!');
    setFolders([...folders, { id: uuidv4(), name, files: [], subfolders: [] }]);
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
      setFolders(prev => updateFolderFiles(prev, folderId, [fileToMove]));
      setRootFiles(prev => prev.filter((_, i) => i !== Number(draggedIndex)));
    } else {
      const droppedFiles = e.dataTransfer.files;
      const fileArray = Array.from(droppedFiles).map(file => ({
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(2) + ' KB',
      }));
      setFolders(prev => updateFolderFiles(prev, folderId, fileArray));
    }
  };

  const updateFolderFiles = (folderList, targetId, newFiles) => {
    return folderList.map(folder => {
      if (folder.id === targetId) {
        return {
          ...folder,
          files: [...folder.files, ...newFiles],
        };
      } else if (folder.subfolders?.length > 0) {
        return {
          ...folder,
          subfolders: updateFolderFiles(folder.subfolders, targetId, newFiles),
        };
      }
      return folder;
    });
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    setDragOverId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleAddSubfolder = (parentId, name) => {
    const newSubfolder = {
      id: uuidv4(),
      name,
      files: [],
      subfolders: [],
    };
    setFolders(prev => addSubfolder(prev, parentId, newSubfolder));
  };

  const addSubfolder = (folderList, parentId, newSubfolder) => {
    return folderList.map(folder => {
      if (folder.id === parentId) {
        return {
          ...folder,
          subfolders: [...(folder.subfolders || []), newSubfolder],
        };
      } else if (folder.subfolders?.length) {
        return {
          ...folder,
          subfolders: addSubfolder(folder.subfolders, parentId, newSubfolder),
        };
      }
      return folder;
    });
  };

  const removeFolderById = (folderList, idToRemove) => {
    return folderList.map(folder => {
      if (folder.id === idToRemove) return null;
      if (folder.subfolders?.length) {
        const updatedSubs = removeFolderById(folder.subfolders, idToRemove);
        return { ...folder, subfolders: updatedSubs.filter(Boolean) };
      }
      return folder;
    }).filter(Boolean);
  };

  const handleFolderDrop = (e, targetFolderId) => {
    e.preventDefault();
    if (!draggedFolder || draggedFolder.id === targetFolderId) return;
    const updated = removeFolderById(folders, draggedFolder.id);
    const newFolders = addSubfolder(updated, targetFolderId, draggedFolder);
    setFolders(newFolders);
    setDraggedFolder(null);
  };

  const handleSetActiveFolder = (folderId) => {
    const found = findFolderById(folders, folderId);
    if (found) setActiveFolder(found);
  };

  const findFolderById = (folderList, folderId) => {
    for (const folder of folderList) {
      if (folder.id === folderId) return folder;
      if (folder.subfolders?.length) {
        const result = findFolderById(folder.subfolders, folderId);
        if (result) return result;
      }
    }
    return null;
  };

  const enterFolder = (folder) => {
    setFolderStack((prev) => [...prev, folder]);
    setActiveFolder(folder);
  };

  const goBack = () => {
    setFolderStack((prev) => {
      const newStack = [...prev];
      newStack.pop();
      const last = newStack[newStack.length - 1] || null;
      setActiveFolder(last);
      return newStack;
    });
  };

  return {
    folders, setFolders, newFolderName, setNewFolderName,
    editingId, setEditingId, editedName, setEditedName,
    activeFolder, handleSetActiveFolder, rootFiles, setRootFiles,
    dragOverId, setDragOverId, handleAddFolder, handleRename, handleDelete,
    handleFileDrop, handleDragOver, handleDragLeave, handleAddSubfolder,
    enterFolder, goBack, draggedFolder, setDraggedFolder, handleFolderDrop
  };
}
