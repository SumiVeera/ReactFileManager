import React from 'react';
import FolderList from './FolderList';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

function MainContent({
    activeFolder, setActiveFolder, folders,
    setFolders, rootFiles, setRootFiles,
    handleFileDrop, handleDragOver, dragOverId, handleDragLeave,
    enterFolder, goBack,
    handleFolderDrop, setDraggedFolder, updateFolderFiles,
    setDraggedFile, uploadQueue, layout, setLayout,
    uploadFilesWithProgress, getBreadcrumbPath,
}) {
    return (
        <div
            className="flex-1 p-6"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {/* Shared header bar */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">
                    {activeFolder ? `📁 ${activeFolder.name}` : 'Welcome to File Management'}
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLayout('list')}
                        className={`p-1 ${layout === 'list' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600`}
                        title="List View"
                    >
                        <ListBulletIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setLayout('grid')}
                        className={`p-1 ${layout === 'grid' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600`}
                        title="Grid View"
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Breadcrumb path only if inside a folder */}
            <div className="text-sm text-gray-600 mb-2 flex flex-wrap gap-1">
                <span className="flex items-center">
                    <button
                        className="hover:underline text-blue-600"
                        onClick={() => {
                            enterFolder(null);  
                        }}
                    >
                        Home
                    </button>
                    {activeFolder && <span className="mx-1">/</span>}
                </span>

                {/* Only render folders if in a folder */}
                {activeFolder &&
                    getBreadcrumbPath(activeFolder, folders).map((f, index, arr) => (
                        <span key={f.id} className="flex items-center">
                            <button
                                className="hover:underline text-blue-600"
                                onClick={() => enterFolder(f)}
                            >
                                {f.name}
                            </button>
                            {index < arr.length - 1 && <span className="mx-1">/</span>}
                        </span>
                    ))
                }
            </div>


            {activeFolder ? (
                <div>
                    {/* Drop area for files in folder */}
                    <div
                        className={`mt-4 p-6 ${dragOverId === activeFolder.id ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const systemFiles = e.dataTransfer.files;
                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles && systemFiles.length > 0) {
                                handleFileDrop(e, activeFolder.id);
                            } else if (sourceFolderId || draggedIndex) {
                                handleFileDrop(e, activeFolder.id);
                            } else {
                                handleFolderDrop(e, activeFolder.id);
                            }
                        }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, activeFolder.id); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); handleDragLeave(); }}
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
                            {layout === 'grid' ? (
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {activeFolder.subfolders.map(sub => (
                                        <li
                                            key={sub.id}
                                            className="p-3 border rounded bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                                            onDoubleClick={() => enterFolder(sub)}
                                            draggable
                                            onDragStart={(e) => { e.stopPropagation(); setDraggedFolder(sub); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const systemFiles = e.dataTransfer.files;
                                                const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                                                const draggedIndex = e.dataTransfer.getData('file-index');

                                                if (systemFiles && systemFiles.length > 0) {
                                                    handleFileDrop(e, sub.id);
                                                } else if (sourceFolderId || draggedIndex) {
                                                    handleFileDrop(e, sub.id);
                                                } else {
                                                    handleFolderDrop(e, sub.id);
                                                }
                                            }}
                                            onDragOver={(e) => handleDragOver(e, sub.id)}
                                            onDragLeave={handleDragLeave}
                                        >
                                            {sub.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-2">
                                    {activeFolder.subfolders.map(sub => (
                                        <li
                                            key={sub.id}
                                            className="p-2 border rounded bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                                            onDoubleClick={() => enterFolder(sub)}
                                            draggable
                                            onDragStart={(e) => { e.stopPropagation(); setDraggedFolder(sub); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const systemFiles = e.dataTransfer.files;
                                                const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                                                const draggedIndex = e.dataTransfer.getData('file-index');

                                                if (systemFiles && systemFiles.length > 0) {
                                                    handleFileDrop(e, sub.id);
                                                } else if (sourceFolderId || draggedIndex) {
                                                    handleFileDrop(e, sub.id);
                                                } else {
                                                    handleFolderDrop(e, sub.id);
                                                }
                                            }}
                                            onDragOver={(e) => handleDragOver(e, sub.id)}
                                            onDragLeave={handleDragLeave}
                                        >
                                            {sub.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Files in folder */}
                    <div
                        className={`mt-6 h-screen ${dragOverId === activeFolder.id ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const systemFiles = e.dataTransfer.files;
                            const sourceFolderId = e.dataTransfer.getData('source-folder-id');
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles && systemFiles.length > 0) {
                                handleFileDrop(e, activeFolder.id);
                            } else if (sourceFolderId || draggedIndex) {
                                handleFileDrop(e, activeFolder.id);
                            } else {
                                handleFolderDrop(e, activeFolder.id);
                            }
                        }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, activeFolder.id); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); handleDragLeave(); }}
                    >
                        <h3 className="text-lg font-semibold mb-2">📄 Files</h3>
                        {activeFolder.files.length === 0 ? (
                            <p className="text-gray-500">No files yet.</p>
                        ) : layout === 'grid' ? (
                            <div className="grid grid-cols-3 gap-4">
                                {activeFolder.files.map((file, index) => (
                                    <div
                                        key={index}
                                        draggable
                                        onDragStart={(e) => { e.dataTransfer.setData('file-index', index); setDraggedFile(file); }}
                                        className="bg-white border p-4 rounded shadow cursor-move"
                                    >
                                        📄 {file.name} <br />
                                        <small className="text-gray-600">{file.size}</small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {activeFolder.files.map((file, index) => (
                                    <li
                                        key={index}
                                        draggable
                                        onDragStart={(e) => { e.dataTransfer.setData('file-index', index); setDraggedFile(file); }}
                                        className="bg-white border p-2 rounded shadow cursor-move"
                                    >
                                        📄 {file.name} ({file.size})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ) : (
                <>
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
                        layout={layout}
                        setLayout={setLayout}
                        activeFolder={activeFolder}
                    />

                    {/* Root files drop area */}
                    <div
                        className={`mt-4 p-6 h-screen ${dragOverId === activeFolder ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'}`}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const systemFiles = e.dataTransfer.files;
                            const draggedIndex = e.dataTransfer.getData('file-index');

                            if (systemFiles.length > 0) {
                                uploadFilesWithProgress(Array.from(systemFiles));
                                } else if (draggedIndex !== '') {
                                handleFileDrop(e, null);
                            }
                        }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, activeFolder); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); handleDragLeave(); }}
                    >
                        {rootFiles.length > 0 && (
                            layout === 'grid' ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {rootFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={(e) => { e.dataTransfer.setData('file-index', index); setDraggedFile(file); }}
                                            className="bg-white border p-4 rounded shadow cursor-move"
                                        >
                                            📄 {file.name} <br />
                                            <small className="text-gray-600">{file.size}</small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {rootFiles.map((file, index) => (
                                        <li
                                            key={index}
                                            draggable
                                            onDragStart={(e) => { e.dataTransfer.setData('file-index', index); setDraggedFile(file); }}
                                            className="bg-white border p-2 rounded shadow cursor-move"
                                        >
                                            📄 {file.name} ({file.size})
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </>
            )}

            {/* Upload queue */}
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
        </div>
    );
}

export default MainContent;
