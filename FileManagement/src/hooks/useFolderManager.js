// ✅ useFolderManager.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


export default function useFolderManager() {
  const [folders, setFolders] = useState([
    { id: '1', name: 'NDA', files: [], subfolders: [], parentId: null },
    { id: '2', name: 'Sales', files: [], subfolders: [], parentId: null },
    { id: '3', name: 'Marketing', files: [], subfolders: [], parentId: null },
  ]);

  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [rootFiles, setRootFiles] = useState([]);
  const [dragOverId, setDragOverId] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [draggedFile, setDraggedFile] = useState(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [layout, setLayout] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    date: '',
    size: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [sortOption, setSortOption] = useState({ field: 'name', order: 'asc' });
  const [uploadPanel, setUploadPanel] = useState({
  isVisible: true,
  isMinimized: false,
  total: 0,
  completed: 0,
  files: []  
});


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
    e.stopPropagation();

    const draggedIndex = e.dataTransfer.getData('file-index');
    const sourceFolderId = e.dataTransfer.getData('source-folder-id');

    // Dragging from root
    if (draggedIndex !== '' && !sourceFolderId) {
      const fileToMove = rootFiles[draggedIndex];
      if (!fileToMove) return;

      const updated = addFilesToFolder(folderId, [fileToMove]);
      setFolders(updated);
      setRootFiles(prev => prev.filter((_, i) => i !== Number(draggedIndex)));

      if (activeFolder?.id === folderId) {
        const updatedActive = findFolderById(updated, folderId);
        setActiveFolder(updatedActive);
      }

      return;
    }

    // Dragging from another folder (not root)
    if (draggedFile && sourceFolderId) {
      const cleanedFolders = removeFileFromFolder(folders, sourceFolderId, draggedFile.name);
      const updated = addFilesToFolder(cleanedFolders, folderId, [draggedFile]);

      setFolders(updated);

      if (activeFolder?.id === folderId) {
        const updatedActive = findFolderById(updated, folderId);
        setActiveFolder(updatedActive);
      }

      setDraggedFile(null);
      return;
    }

    // Dropping system files (upload)
    const items = e.dataTransfer.items;
    
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          if (entry.isFile) {
            entry.file(file => uploadFilesWithProgress([file], folderId));
          } else if (entry.isDirectory) {
            readDirectory(entry, folderId);
          }
        }
      }

      if (activeFolder?.id === folderId) {
        const updatedActive = findFolderById(folders, folderId);
        setActiveFolder(updatedActive);
      }

      return;
    }

  };

  const removeFileFromFolder = (folderList, folderId, fileName) => {
    return folderList.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          files: folder.files.filter(file => file.name !== fileName),
        };
      } else if (folder.subfolders?.length) {
        return {
          ...folder,
          subfolders: removeFileFromFolder(folder.subfolders, folderId, fileName),
        };
      }
      return folder;
    });
  };

  const updateFolderFiles = (folderId, newFiles) => {
    setFolders(prev => {
      const updated = addFilesToFolder(prev, folderId, newFiles);

      if (activeFolder?.id === folderId) {
        const updatedActive = findFolderById(updated, folderId);
        setActiveFolder(updatedActive);
      }
      return updated;
    });
  };


  const addFilesToFolder = (folderList, targetId, newFiles) => {
    return folderList.map(folder => {
      if (folder.id === targetId) {
        return { ...folder, files: [...folder.files, ...newFiles] };
      } else if (folder.subfolders?.length) {
        return {
          ...folder,
          subfolders: addFilesToFolder(folder.subfolders, targetId, newFiles),
        };
      }
      return folder;
    });
  }


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
      parentId: parentId,
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

  const simulateUpload = (file, folderId) => {
    const uploadId = uuidv4();
    const uploadItem = { id: uploadId, name: file.name, progress: 0 };
    setUploadQueue(prev => [...prev, uploadItem]);

    const interval = setInterval(() => {
      setUploadQueue(prevQueue => {
        return prevQueue.map(item => {
          if (item.id === uploadId) {
            const newProgress = Math.min(item.progress + Math.random() * 20, 100);
            return { ...item, progress: newProgress };
          }
          return item;
        });
      });
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
      updateFolderFiles(folderId, [{
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
      }]);
    }, 3000 + Math.random() * 3000);
  };

  


  const readDirectory = (directoryEntry, parentFolderId) => {
    const newFolderId = uuidv4();
    const newFolder = {
      id: newFolderId,
      name: directoryEntry.name,
      files: [],
      subfolders: [],
      parentId: parentFolderId,
    };

    // 👇 Add new folder under its parent
    setFolders(prev => {
      let updated;
      if (parentFolderId === null) {
        updated = [...prev, newFolder];
      } else {
        updated = addSubfolder(prev, parentFolderId, newFolder);

      }

      if (parentFolderId === null) {
        setActiveFolder(null);
        setFolderStack([]);
      }
      else {
        const updatedActive = findFolderById(updated, parentFolderId);
        if (updatedActive) {
          setActiveFolder(updatedActive);

          // ✅ Also update folderStack
          setFolderStack(prev => {
            const existingStack = prev.filter(f => f.id !== updatedActive.id);
            return [...existingStack, updatedActive];
          });
        }
      }
      return updated;
    });


    // Read the contents of this new folder
    const reader = directoryEntry.createReader();
    reader.readEntries((entries) => {
      entries.forEach(entry => {
        if (entry.isFile) {
          entry.file(file => uploadFilesWithProgress([file], newFolderId));
        } else if (entry.isDirectory) {
          readDirectory(entry, newFolderId);
        }
      });
    });
  };

  const uploadFilesWithProgress = async (files, targetFolderId = null) => {
  const filesArray = Array.from(files);

  const fileStatuses = filesArray.map(file => ({
    id: uuidv4(),
    name: file.name,
    progress: 0,
    status: 'pending'
  }));

  // Show the upload panel
  setUploadPanel({
    isVisible: true,
    isMinimized: false,
    total: fileStatuses.length,
    completed: 0,
    files: fileStatuses
  });

  const uploads = fileStatuses.map((fileStatus, index) => {
    const file = filesArray[index];

    return new Promise(resolve => {
      const newFile = {
        id: fileStatus.id,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;

        setUploadPanel(prev => {
          const updatedFiles = prev.files.map(f =>
            f.id === fileStatus.id ? { ...f, progress: Math.min(progress, 100) } : f
          );
          return { ...prev, files: updatedFiles };
        });

        if (progress >= 100) {
          clearInterval(interval);

          try {
            // File upload complete - update folder or root
            if (targetFolderId) {
              setFolders(prev => {
                const updated = prev.map(folder =>
                  folder.id === targetFolderId
                    ? { ...folder, files: [...folder.files, newFile] }
                    : folder
                );

                // Update active folder if needed
                if (activeFolder?.id === targetFolderId) {
                  const updatedActive = findFolderById(updated, targetFolderId);
                  setActiveFolder(updatedActive);
                }

                return updated;
              });
            } else {
              setRootFiles(prev => [...prev, newFile]);
            }

            // Mark as success
            setUploadPanel(prev => {
              const updatedFiles = prev.files.map(f =>
                f.id === fileStatus.id ? { ...f, status: 'success' } : f
              );
              return {
                ...prev,
                completed: prev.completed + 1,
                files: updatedFiles,
              };
            });
          } catch (error) {
            console.error('Upload failed', error);
            // Mark as error
            setUploadPanel(prev => {
              const updatedFiles = prev.files.map(f =>
                f.id === fileStatus.id ? { ...f, status: 'error' } : f
              );
              return {
                ...prev,
                completed: prev.completed + 1,
                files: updatedFiles,
              };
            });
          }

          resolve();
        }
      }, 200);
    });
  });

  await Promise.all(uploads);
};


  
  const getBreadcrumbPath = (folder, folders) => {
    const path = [];
    let current = folder;

    while (current) {
      path.unshift(current);
      current = current.parentId ? findFolderById(folders, current.parentId) : null;
    }

    return path;
  };

  const getFilteredFiles = () => {
    const files = activeFolder ? activeFolder.files : rootFiles;

    if (searchQuery && searchQuery.length < 3) {
      return [];
    }

    // Step 1: Apply filters
    let filteredFiles = files.filter(file => {
      const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFileType = !filters.fileType || file.type === filters.fileType;
      return matchesSearch && matchesFileType;
    });

    // Step 2: Apply sorting
    const { field, order } = sortOption || {};
    const sortedFiles = [...filteredFiles];

    sortedFiles.sort((a, b) => {
      let valA, valB;

      switch (field) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'dateModified':
          valA = new Date(a.modifiedAt);
          valB = new Date(b.modifiedAt);
          break;
        case 'dateCreated':
          valA = new Date(a.createdAt);
          valB = new Date(b.createdAt);
          break;
        case 'size':
          valA = a.size;
          valB = b.size;
          break;
        case 'type':
          valA = a.type.toLowerCase();
          valB = b.type.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sortedFiles;
  };

  const updateSortOption = (newSort) => {
    setSortOption(newSort);
  };






  const handleSearch = (query) => {
    setSearchQuery(query.trim());
  }

  const clearSearch = () => {
    setSearchQuery('');
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };



  const toggleFileSelection = (file) => {
    setSelectedFiles(prev => {
      const exists = prev.find(f => f.name === file.name);
      return exists ? prev.filter(f => f.name !== file.name) : [...prev, file];
    });
  };

  const clearSelection = () => setSelectedFiles([]);

  const selectAllFiles = () => {
    const files = activeFolder ? activeFolder.files : rootFiles;
    setSelectedFiles(files);
  };

  const deleteSelectedFiles = () => {
    let deletedCount = 0;

    if (activeFolder) {
      const newFiles = activeFolder.files.filter(file => {
        const shouldDelete = selectedFiles.find(f => f.name === file.name);
        if (shouldDelete) deletedCount++;
        return !shouldDelete;
      });

      const updatedFolder = { ...activeFolder, files: newFiles };
      setActiveFolder(updatedFolder);
      setFolders(prev =>
        prev.map(f => f.id === activeFolder.id ? updatedFolder : f)
      );
    } else {
      const newRootFiles = rootFiles.filter(file => {
        const shouldDelete = selectedFiles.find(f => f.name === file.name);
        if (shouldDelete) deletedCount++;
        return !shouldDelete;
      });
      setRootFiles(newRootFiles);
    }

    setSelectedFiles([]);
    return deletedCount;
  };

  return {
    folders, setFolders, newFolderName, setNewFolderName,
    editingId, setEditingId, editedName, setEditedName,
    activeFolder, handleSetActiveFolder, rootFiles, setRootFiles,
    dragOverId, setDragOverId, handleAddFolder, handleRename, handleDelete,
    handleFileDrop, handleDragOver, handleDragLeave, handleAddSubfolder,
    enterFolder, goBack, draggedFolder, setDraggedFolder, handleFolderDrop,
    updateFolderFiles, draggedFile, setDraggedFile, folderStack,
    uploadQueue, layout, setLayout, uploadFilesWithProgress,
    getBreadcrumbPath, searchQuery, clearSearch,
    filters, updateFilters, getFilteredFiles, handleSearch,
    selectedFiles, toggleFileSelection, clearSelection,
    selectAllFiles, deleteSelectedFiles, lastSelectedIndex, setLastSelectedIndex,
    setSelectedFiles, sortOption, updateSortOption,setSortOption,
    uploadPanel,setUploadPanel,
    

  };
}

