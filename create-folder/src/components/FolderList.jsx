import React from 'react';

function FolderList({ folders }) {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {folders.map(folder => (
        <div key={folder.id} style={{
          border: "1px solid #ccc",
          padding: "20px",
          width: "150px",
          textAlign: "center",
          borderRadius: "8px",
        }}>
          📁 {folder.name}
        </div>
      ))}
    </div>
  );
}

export default FolderList;
