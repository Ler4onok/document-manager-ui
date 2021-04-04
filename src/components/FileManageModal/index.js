import React, { useState } from 'react';
import { Modal } from "../Modal";

const FileManageModal = ({initialData={}, handleSubmit, onClose}) => {
  // const [file, setFile] = useState(null);
  // const [filename, setFilename] = useState('');

  const [fileFields, setFileFields] = useState({
    file: initialData.file || '',
    filename: initialData.filename || ''
  })

  // const handleInput = (event, key) => {
  //   setFileFields({ ...fileFields, [key]: event.target.value });
  // };

  const onSubmit = () => handleSubmit(fileFields);


  const handleFileUpload = (event) => {
    const _file = event.target.files[0];
    setFileFields({...fileFields, filename: _file.name.split('.')[0]});
    setFileFields({...fileFields, file: _file});
  };

  const hasFile = fileFields.file !== null;


  return (
    <Modal
      handleSubmit={onSubmit}
      onClose={onClose}
      header="Add a new file"
      // newObject={newFile}
    >
      <input
        type="file"
        id="grade_csv"
        // name="lalal"
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
              value={fileFields.filename}
              onChange={(event) =>  setFileFields({ ...fileFields, filename: event.target.value })}
            />
          </div>
          <div>Filetype: {fileFields.file.type}</div>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
    </Modal>
  );
};

export { FileManageModal };
