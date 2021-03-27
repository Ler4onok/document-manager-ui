import { Button, FormControl, InputLabel, Select, TextField, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import { Modal } from '../Modal';

const FolderManageModal = ({ initialData = {}, handleSubmit, onClose }) => {
  const [error, setError] = useState(null);
  const [isOpenPermissionOptions, setOpenPermissionOptions] = useState(null);
  const [folderFields, setFolderFields] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    userURI: initialData.userURI || '',
    permissionLevel: initialData.permissionLevel || '',
    // type: initialData.type || '',
  })

  const handleInput = (event, key) => {
    setFolderFields({ ...folderFields, [key]: event.target.value });
  };

  const onSubmit = () => handleSubmit(folderFields);

  return (
    <Modal
      handleSubmit={onSubmit}
      onClose={onClose}
      // header={`${newFolder.event} a ${newFolder.type.toLowerCase()}`}
    >
      <div className="modalContent" style={{ width: "89%" }}>
        <TextField
          style={{
            width: "100%",
            marginBottom: "5px",
            marginTop: "10px",
          }}
          id="outlined-basic"
          label="Document name"
          variant="outlined"
          // label="Folder Name"
          value={folderFields.name}
          onChange={(event) => handleInput(event, "name")}
        />
        <TextField
          style={{ width: "100%", marginBottom: "10px" }}
          id="outlined-basic"
          label="Document description"
          variant="outlined"
          value={folderFields.description}
          onChange={(event) => handleInput(event, "description")}
        />
        {error != null && <div style={{ color: "red" }}>{error}</div>}
        <div
          style={{
            textAlign: "center",
            cursor: "pointer",
            color: "#2196f3",
            marginBottom: "10px",
          }}
          onClick={() => setOpenPermissionOptions(!isOpenPermissionOptions)}
        >
          Add user permissions
        </div>
        {isOpenPermissionOptions && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="outlined-basic"
              label="User URI"
              variant="outlined"
              value={folderFields.userURI}
              onChange={(event) => handleInput(event, "userURI")}
            />
            <FormControl style={{ width: "40%", margin: "0px 40px 0px 15px" }}>
              <InputLabel id="demo-simple-select-label">
                Permission Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={folderFields.permissionLevel}
                onChange={(event) => {
                  handleInput(event, "permissionLevel");
                  // setUserPermission(event.target.value);
                }}
              >
                <MenuItem value={"NONE"}>None</MenuItem>
                <MenuItem value={"READ"}>Read</MenuItem>
                <MenuItem value={"WRITE"}>Write</MenuItem>
                <MenuItem value={"SECURITY"}>Security</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ background: "#2196f3", height: "35px" }}
              // onClick={() => handleAddUserPermission("Add")}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export { FolderManageModal };
