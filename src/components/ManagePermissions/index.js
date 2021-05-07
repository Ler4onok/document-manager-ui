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
import { addUserPermission, deleteUserPermission, getDocumentPermissions, getUsers } from "../../features/document/api";


export const ManagePermissions = ({initialData = {}, folderId }) => {

  const [userPermissions, setUserPermissions] = useState([]);
  const [userExistsError, setUserExistsError] = useState('');
  const [userList, setUserList] = useState([]);
  const [folderFields, setFolderFields] = useState({
    userURI: initialData.userURI || "",
    permissionLevel: initialData.permissionLevel || "",
  });

  const handleInput = (event, key) => {
    setFolderFields({ ...folderFields, [key]: event.target.value });
  };

  // check if user with such uri exists
  const ifExists = (permission) => {
    return permission['http://example.cz/userUri'] === `http://example.org/users/${folderFields.userURI}`
  }

  const handleAddPermission = () => {
    const existingPermission = userPermissions.find(ifExists)
    if (existingPermission){
      setUserExistsError('User with such URI has the permission. Please, delete the existing permission before adding a new one')
    }
    else{
      addUserPermission(getLinkInfo(folderId, 2), folderFields.permissionLevel,  folderFields.userURI)
      .then((result) => setUserPermissions([...userPermissions, result]));
      setUserExistsError('');
      setFolderFields({userURI: '', permissionLevel: ''})
    }
  }

  const handleDeletePermission = (id) => {
    const newPermissionsList = userPermissions.filter(permission => permission["@id"] !== id)
    setUserPermissions(newPermissionsList);
    deleteUserPermission(getLinkInfo(id, 2));

  }

  useEffect(() => {
    if (folderId) {
      const documentId = getLinkInfo(folderId, 2);
      getDocumentPermissions(
        documentId
      ).then((permissionsList) => {
        setUserPermissions(permissionsList.filter(permission => permission['http://example.cz/userUri'] !== localStorage.getItem('currentUserUri')))

      }
      );
    }

    getUsers().then(userList => setUserList(userList.filter(user => user['uri'] !== localStorage.getItem('currentUserUri'))))
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
                  onClick={() => handleDeletePermission(item["@id"])}
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
      <FormControl style={{ width: "40%", margin: "0px 15px 0px 15px" }}>
      <InputLabel id="userUri">
            User URI
          </InputLabel>
      <Select
            labelId="userUri"
            id="demo-simple-select"
            value={folderFields.userURI}
            onChange={(event) => {
              handleInput(event, "userURI");
            }}
          >
            {userList.map(user => <MenuItem value={getLinkInfo(user['uri'], 2)}>{getLinkInfo(user['uri'], 2)}</MenuItem> )}
            
           
          </Select>
          </FormControl>
        {/* <TextField
          id="outlined-basic"
          label="User URI"
          variant="outlined"
          value={folderFields.userURI}
          onChange={(event) => handleInput(event, "userURI")}
        /> */}
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
          onClick={handleAddPermission}>
          Add
        </Button>
      </StyledAddPermissionsWrapper>
      {(userExistsError.length > 0 && <p style={{color:'red', margin:'0'}}>{userExistsError}</p>)}
    </div>
  );
};
