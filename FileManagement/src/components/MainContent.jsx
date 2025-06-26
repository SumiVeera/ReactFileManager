import React from 'react';
import FolderList from './FolderList';

function MainContent({
    activeFolder, setActiveFolder, folders,
    setFolders, rootFiles, setRootFiles,
    handleFileDrop, handleDragOver, dragOverId, handleDragLeave,
    enterFolder, goBack,
    handleFolderDrop, setDraggedFolder, updateFolderFiles,
    setDraggedFile, uploadQueue
}) {
    return (
        <div className="flex-1 p-6"
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {activeFolder ? (
                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">📁 {activeFolder.name}</h1>
                        <button
                            className="px-4 py-1 bg-gray-300 rounded"
                            onClick={goBack}
                        >
                            🔙 Back to all folders
                        </button>
                    </div>
                    <div
                        className={`mt-4 p-6 
                            ${dragOverId === activeFolder.id ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            //handleFileDrop(e, activeFolder.id)
                            const systemFiles = e.dataTransfer.files;
                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles && systemFiles.length > 0) {
                                // ✅ Drop from system (Google Drive-style)
                                handleFileDrop(e, activeFolder.id);
                            } else if (sourceFolderId || draggedIndex) {
                                // ✅ Internal file move
                                handleFileDrop(e, activeFolder.id);
                            } else {
                                // ✅ Possibly folder move
                                handleFolderDrop(e, activeFolder.id);
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragOver(e, activeFolder.id)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragLeave();
                        }}
                    >
                        <p className="text-gray-700">📁 Drag & drop files here or click to select</p>
                        <input
                            type="file"
                            multiple
                            className="mt-2"
                            onChange={(e) => {
                                const newFiles = Array.from(e.target.files).map(file => ({
                                    name: file.name,
                                    size: (file.size / 1024).toFixed(2) + ' KB',
                                    type: file.type,
                                }));
                                updateFolderFiles(activeFolder.id, newFiles);
                            }}
                        />
                    </div>


                    {/* Subfolders */}
                    {activeFolder.subfolders?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">📁 Subfolders</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {activeFolder.subfolders.map((sub) => (
                                    <li
                                        key={sub.id}
                                        className="p-3 border rounded bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                                        onClick={() => enterFolder(sub)}
                                        draggable
                                        onDragStart={(e) => {
                                            e.stopPropagation();
                                            //e.dataTransfer.setData('text/plain', 'folder');
                                            setDraggedFolder(sub);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            const systemFiles = e.dataTransfer.files;
                                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                                            const draggedIndex = e.dataTransfer.getData('file-index');

                                            if (systemFiles && systemFiles.length > 0) {
                                                handleFileDrop(e, sub.id); // ✅ Upload system files into subfolder
                                            } else if (sourceFolderId || draggedIndex) {
                                                handleFileDrop(e, sub.id); // ✅ Move internal file into subfolder
                                            } else {
                                                handleFolderDrop(e, sub.id); // ✅ Folder drop (moving folders)
                                            }
                                        }}

                                        onDragOver={(e) => handleDragOver(e, sub.id)}
                                        onDragLeave={handleDragLeave}


                                    >
                                        {sub.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Files */}
                    <div className={`mt-6 h-screen
                           ${dragOverId === activeFolder.id ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            //handleFileDrop(e, activeFolder.id)
                            const systemFiles = e.dataTransfer.files;
                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles && systemFiles.length > 0) {
                                // ✅ Drop from system (Google Drive-style)
                                handleFileDrop(e, activeFolder.id);
                            } else if (sourceFolderId || draggedIndex) {
                                // ✅ Internal file move
                                handleFileDrop(e, activeFolder.id);
                            } else {
                                // ✅ Possibly folder move
                                handleFolderDrop(e, activeFolder.id);
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragOver(e, activeFolder.id)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragLeave();
                        }}>
                        <h3 className="text-lg font-semibold mb-2">📄 Files</h3>
                        <ul className="space-y-2">
                            {activeFolder.files.length === 0 ? (
                                <li className="text-gray-500">No files yet.</li>
                            ) : (
                                activeFolder.files.map((file, index) => (
                                    <li key={index}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('file-index', index);
                                            //e.dataTransfer.setData('source-folder-id', activeFolder.id);
                                            setDraggedFile(file);
                                            //activeFolder.files[index]);
                                        }}
                                    >📄 {file.name} ({file.size})</li>
                                ))
                            )}
                        </ul>
                    </div>

                </div>
            ) : (
                <>
                    {/* when the home folder is in focus (when subfolder is not in focus) */}
                    <h1 className="text-xl font-bold">Welcome to File Management</h1>
                    <p className="text-gray-600 mt-2">Select a folder to view files.</p>


                    {/* Listing all folders */}
                    <FolderList
                        folders={folders ?? []}
                        onFolderClick={enterFolder}
                        handleFileDrop={handleFileDrop}
                        handleDragOver={handleDragOver}
                        dragOverId={dragOverId}
                        handleDragLeave={handleDragLeave}
                        handleFolderDrop={handleFolderDrop}
                        setDraggedFolder={setDraggedFolder}
                        setDraggedFile={setDraggedFile}
                    />


                    <div
                        className={`mt-4 p-6  h-screen 
                            ${dragOverId === activeFolder ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFileDrop(e, activeFolder);
                            const systemFiles = e.dataTransfer.files;
                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles && systemFiles.length > 0) {
                                // ✅ Drop into root area
                                const fileArray = Array.from(systemFiles).map(file => ({
                                    name: file.name,
                                    size: (file.size / 1024).toFixed(2) + ' KB',
                                    type: file.type,
                                }));
                                setRootFiles(prev => [...prev, ...fileArray]);
                            } else if (draggedIndex !== '') {
                                // ✅ Move file from folder to root
                                handleFileDrop(e, null);
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragOver(e, activeFolder)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragLeave();
                        }}
                    >

                        {
                            //  Listing all files in the root folder
                            rootFiles.length > 0 && (
                                <div className="mt-6">
                                    <ul className="space-y-2 text-sm">
                                        {rootFiles.map((file, index) => (
                                            <li
                                                key={index}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('file-index', index);

                                                    setDraggedFile(file);
                                                }}
                                                className="bg-white border p-2 rounded shadow cursor-move"
                                            >
                                                📄 {file.name} ({file.size})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                    </div>
                </>
            )
            }
            {uploadQueue.length > 0 && (
                <div className="fixed bottom-4 right-4 w-64 bg-white border rounded shadow-lg p-3 z-50">
                    <h4 className="text-sm font-semibold mb-2">Uploading...</h4>
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {uploadQueue.map(file => (
                            <li key={file.id} className="text-xs">
                                {file.name}
                                <div className="w-full h-2 bg-gray-200 rounded mt-1">
                                    <div
                                        className="h-2 bg-blue-500 rounded"
                                        style={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div >
    );
}

export default MainContent;
