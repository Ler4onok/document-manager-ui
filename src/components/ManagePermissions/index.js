import React, {useState, useEffect} from "react";
import {
  StyledAddPermissionsWrapper,
  StyledPermissionsItemWrapper,
  StyledPermissionsTitle,
  StyledPermissionsWrapper,
} from "./styled";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { getLinkInfo } from "../../features/document/utils";
import { getDocumentPermissions } from "../../features/document/api";


export const ManagePermissions = ({initialData = {}, folderId, handleDeleteUserPermission }) => {

  const [userPermissions, setUserPermissions] = useState([]);
  const [folderFields, setFolderFields] = useState({
    userURI: initialData.userURI || "",
    permissionLevel: initialData.permissionLevel || "",
  });

  const handleInput = (event, key) => {
    setFolderFields({ ...folderFields, [key]: event.target.value });
  };

  useEffect(() => {
    if (folderId) {
      const documentId = getLinkInfo(folderId, 2);
      getDocumentPermissions(
        documentId
      ).then((result) => setUserPermissions(result));
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <StyledPermissionsTitle>Permissions</StyledPermissionsTitle>
      {userPermissions.length > 0 ? (
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
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ height: "40px" }}
                  onClick={() => handleDeleteUserPermission(item["@id"])}
                >
                  Delete
                </Button>
              </StyledPermissionsItemWrapper>
            );
          })}
        </StyledPermissionsWrapper>
      ) : (
        <div>There are no user permissions yet</div>
      )}

      <StyledPermissionsTitle>Add user permissions</StyledPermissionsTitle>
      <StyledAddPermissionsWrapper>
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
          variant="outlined"
          color="primary"
          style={{ color: "#2196f3", height: "35px" }}
          // onClick={() => handleAddUserPermission("Add")}
        >
          Add
        </Button>
      </StyledAddPermissionsWrapper>
    </div>
  );
};
