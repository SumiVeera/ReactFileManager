import React, { useState } from 'react';

function CreateFolder({ onAdd }) {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(folderName);
        setFolderName('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
                style={{ padding: "8px", marginRight: "8px" }}
            />
            <button type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow-md transition duration-200"
                style={{ padding: "8px" }}>
                Create Folder</button>
        </form>
    );
}

export default CreateFolder;
