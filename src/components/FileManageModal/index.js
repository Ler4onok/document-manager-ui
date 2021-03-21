import React, { useState } from 'react';
import { Modal } from "../Modal";

const FileManageModal = ({ handleAddFile, onClose }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileUpload = (event) => {
    const _file = event.target.files[0];
    setFilename(_file.name.split('.')[0]);
    setFile(_file);
  };

  const hasFile = file !== null;

  return (
    <Modal
      handleSubmit={handleAddFile}
      onClose={onClose}
      header="Add a new file"
      // newObject={newFile}
    >
      <input
        type="file"
        id="grade_csv"
        name="lalal"
        onChange={handleFileUpload}
        style={{ marginTop: "10px" }}
      />
      {hasFile ? (
        <div>
          <div>
            {" "}
            Filename:{" "}
            <input
              type="text"
              value={filename}
              onChange={(event) => setFilename(event.target.value)}
            />
          </div>
          <div>Filetype: {file.type}</div>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
    </Modal>
  );
};

export { FileManageModal };
