import { X, Minus, CheckCircle, XCircle, Clock } from "lucide-react";

const UploadProgress = ({ uploadPanel, setUploadPanel }) => {
  const { isVisible, isMinimized, completed, total, files } = uploadPanel;

  if (!isVisible) return null;

  const handleMinimize = () => {
    setUploadPanel(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const handleClose = () => {
    setUploadPanel(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-80 border z-50">
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <span className="font-semibold text-sm">Uploading Files ({completed}/{total} Completed)</span>
        <div className="flex gap-2">
          <button onClick={handleMinimize}><Minus size={16} /></button>
          <button onClick={handleClose}><X size={16} /></button>
        </div>
      </div>
      {!isMinimized && (
        <div className="max-h-60 overflow-y-auto p-2">
          <ul className="space-y-2 text-sm">
            {files.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span className="truncate w-48">{file.name}</span>
                {file.status === 'success' && <CheckCircle className="text-green-600" size={16} />}
                {file.status === 'error' && <XCircle className="text-red-600" size={16} />}
                {file.status === 'pending' && <Clock className="text-gray-500 animate-pulse" size={16} />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
