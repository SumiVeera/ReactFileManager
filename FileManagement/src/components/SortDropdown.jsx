import React, { useState, useEffect } from 'react';

const sortOptions = [
  { label: 'Name (A-Z)', value: { field: 'name', order: 'asc' } },
  { label: 'Name (Z-A)', value: { field: 'name', order: 'desc' } },
  { label: 'Date Modified (Newest)', value: { field: 'dateModified', order: 'desc' } },
  { label: 'Date Modified (Oldest)', value: { field: 'dateModified', order: 'asc' } },
  { label: 'Date Created (Newest)', value: { field: 'dateCreated', order: 'desc' } },
  { label: 'Date Created (Oldest)', value: { field: 'dateCreated', order: 'asc' } },
  { label: 'Size (Largest)', value: { field: 'size', order: 'desc' } },
  { label: 'Size (Smallest)', value: { field: 'size', order: 'asc' } },
  { label: 'File Type (A-Z)', value: { field: 'type', order: 'asc' } },
  { label: 'File Type (Z-A)', value: { field: 'type', order: 'desc' } },
];

const SortDropdown = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState(JSON.stringify(sortOptions[0].value)); // default: Name (A-Z)

  useEffect(() => {
    onChange(JSON.parse(selectedValue));
  }, []); // Trigger once on mount with default sort

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(JSON.parse(value));
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      className="p-2 border rounded"
      defaultValue= ""
    >
        <option value="" disabled>Select Sort Option</option>
      {sortOptions.map((opt, index) => (
        <option key={index} value={JSON.stringify(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
