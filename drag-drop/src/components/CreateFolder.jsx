import React, { useState } from 'react';

function CreateFolder({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}

export default CreateFolder;
