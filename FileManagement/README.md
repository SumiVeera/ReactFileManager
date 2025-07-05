# 📁 React File Manager

A basic File Manager UI built with **React** and **Tailwind CSS**, similar to Google Drive. This app allows you to:

- ✅ Create folders
- 📝 Rename and delete folders (with file existence confirmation)
- 📂 Upload files to the root or specific folders
- 🔄 Drag & drop multiple files into folders
- 🧭 Navigate into folders to view their contents
- 📂 Open folders by double-clicking in the main area.
- 🔄 Switch between list view and grid view easily.
- 🧭 See the full folder path at the top (breadcrumb).
- ✅ The current folder is highlighted in the sidebar for easy navigation.

---

## 🚀 Features

- 📁 Create and display folders
- 🗃️ Upload files (to root or folder)
- ✏️ Rename folders
- 🗑️ Delete folders (with file confirmation)
- 📁 Folder Hierarchy with Tree View
- 🖱️ Full Drag & Drop Support
- 💻 Upload Files from System
- ⏳ Simulated Asynchronous Upload with Progress
- Drag & Drop Upload — Multiple Files & Folders
- OS-level Drag & Drop
- Switch Between List & Grid Layouts
- Folder/File Breadcrumb Path
- Double-click to Open Folder
- Active Folder Highlighted in Sidebar
---

## 🛠️ Tech Stack

- ⚛️ React
- 💨 Tailwind CSS
- 🔀 UUID for unique folder IDs

---

## Folder Structure

```bash
src/
├── components/
│   ├── FolderItem.jsx         # Renders folder with subfolders recursively
│   ├── FolderList.jsx         # Displays root folders in right panel
│   ├── MainContent.jsx        # Main file and folder area with drop targets
│   └── Sidebar.jsx            # Tree view with expandable folders
├── hooks/
│   └── useFolderManager.js    # Handles all state and file/folder logic
├── App.jsx
└── index.js
```
---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/react-file-manager.git
cd react-file-manager
```
### 2.Install Dependencies

```bash
npm install
```

###3.Run the Project
```bash
npm run dev
```
### 4.Screenshots

### Main Project

<img width="1507" alt="image" src="https://github.com/user-attachments/assets/0dc241cf-6f27-4bb8-ba14-68a4daea0b14" />

### Added new folder in the main area

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/f76f18d1-9ddf-41b8-aede-62a85fe0f475" />

### Inside a folder created new file

<img width="1502" alt="image" src="https://github.com/user-attachments/assets/217ec04e-0c34-4c99-b58f-24cb7b6834ef" />

### Uploaded a new file in the Main area

<img width="1502" alt="image" src="https://github.com/user-attachments/assets/d45089f1-2e3e-476e-b1c4-9d9db9529612" />

### Dragged the file and dropped into the folder

<img width="1503" alt="image" src="https://github.com/user-attachments/assets/595776ee-c8a3-4130-bd4d-f37818dfae69" />

### Enabled multiple file uploads

<img width="1499" alt="image" src="https://github.com/user-attachments/assets/8a8f0850-2644-46a3-8328-5e43f4e1e81e" />

### Folder Hierarchy with Tree View

<img width="1460" alt="image" src="https://github.com/user-attachments/assets/ddccdcb5-928a-4a93-a387-bef524303d58" />
<img width="1464" alt="image" src="https://github.com/user-attachments/assets/8dc6205f-43f8-4fc5-949a-e5b90eb59c0c" />


### Drag & Drop Support

<img width="1462" alt="image" src="https://github.com/user-attachments/assets/bfccabfe-4620-4fcc-b43d-e9ec09f7b636" />
<img width="1462" alt="image" src="https://github.com/user-attachments/assets/402f3593-73fd-4801-b4d4-d71260214eb7" />

### Upload Files from System

<img width="1460" alt="image" src="https://github.com/user-attachments/assets/17079800-1102-4b6f-9e65-b17cdc60eb8d" />

### Drag and Drop multiple files

<img width="1458" alt="image" src="https://github.com/user-attachments/assets/ad8ca6f6-fff2-4adf-ab37-ed44425cf6d1" />

### Switch Between List & Grid Layouts
#### List View

<img width="1450" alt="image" src="https://github.com/user-attachments/assets/854570bc-9809-4869-9ee3-935d1365d1cf" />

#### Grid View

<img width="1447" alt="image" src="https://github.com/user-attachments/assets/7c331b79-8d91-4207-a2f4-c6a92fad5dd0" />

###Folder/File Breadcrumb Path

<img width="1452" alt="image" src="https://github.com/user-attachments/assets/01d325b6-d61f-4e2d-baf5-90baf1ca4732" />

###Active Folder Highlighted in Sidebar

<img width="1453" alt="image" src="https://github.com/user-attachments/assets/d9820026-c736-4d0f-a8b4-e121b035dc2d" />






















