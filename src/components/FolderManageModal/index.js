import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getDocumentPermissions } from "../../features/document/api";
import { getLinkInfo } from "../../features/document/utils";
import { Modal } from "../Modal";
// import {
//   StyledAddPermissionsWrapper,
//   StyledPermissionsItemWrapper,
//   StyledPermissionsTitle,
//   StyledPermissionsWrapper,
// } from "./styled";

const FolderManageModal = ({
  initialData = {},
  handleSubmit,
  onClose,
  eventType,
  folderId = null,
  handleDeleteUserPermission
}) => {
  const [error, setError] = useState(null);
  const [isOpenPermissionOptions, setOpenPermissionOptions] = useState(null);
  const [folderFields, setFolderFields] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    userURI: initialData.userURI || "",
    permissionLevel: initialData.permissionLevel || "",
    // type: initialData.type || '',
  });

  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    if (folderId) {
      const documentId = getLinkInfo(folderId, 2);
      const userPermissions = getDocumentPermissions(
        documentId
      ).then((result) => setUserPermissions(result));
    }
  }, []);

  const handleInput = (event, key) => {
    setFolderFields({ ...folderFields, [key]: event.target.value });
  };

  const onSubmit = () => handleSubmit(folderFields);
  console.log(userPermissions);
  return (
    <Modal
      handleSubmit={onSubmit}
      onClose={onClose}
      header={eventType + " a folder"}
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
          Manage user permissions
        </div>
        {/* {isOpenPermissionOptions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <StyledPermissionsTitle>Permissions</StyledPermissionsTitle>
            {userPermissions.length > 0 ? 
            <StyledPermissionsWrapper>
              {userPermissions.map((item) => {
                return (
                  <StyledPermissionsItemWrapper>
                    <div>
                      <div>
                        User URI:{" "}
                        {getLinkInfo(item["http://example.cz/userUri"], 2)}
                      </div>
                      <div>Access Level: {item["http://example.cz/level"]}</div>
                    </div>
                    <Button variant="outlined" color="secondary" style={{height: '40px'}} onClick={() => handleDeleteUserPermission(item['@id'])}>
                      Delete
                    </Button>
                  </StyledPermissionsItemWrapper>
                );
              })}
            </StyledPermissionsWrapper>: <div>There are no user permissions yet</div>}

            <StyledPermissionsTitle>
              Add user permissions
            </StyledPermissionsTitle>
            <StyledAddPermissionsWrapper>
              <TextField
                id="outlined-basic"
                label="User URI"
                variant="outlined"
                value={folderFields.userURI}
                onChange={(event) => handleInput(event, "userURI")}
              />
              <FormControl
                style={{ width: "40%", margin: "0px 40px 0px 15px" }}
              >
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
                variant="outlined"
                color="primary"
                style={{ color: "#2196f3", height: "35px" }}
                // onClick={() => handleAddUserPermission("Add")}
              >
                Add
              </Button>
            </StyledAddPermissionsWrapper>
          </div>
        )} */}
      </div>
    </Modal>
  );
};

export { FolderManageModal };
