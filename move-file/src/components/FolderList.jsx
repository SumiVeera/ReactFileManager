function FolderList({ folders }) {
  if (folders.length === 0) return <p className="text-gray-500">No folders yet.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {folders.map(folder => (
        <div key={folder.id} className="bg-gray-100 p-4 rounded shadow text-center">
          📁 {folder.name}
        </div>
      ))}
    </div>
  );
}

export default FolderList;
