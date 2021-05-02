import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getDocumentPermissions } from "../../features/document/api";
import { getLinkInfo } from "../../features/document/utils";
import { ManagePermissions } from "../ManagePermissions";
import { Modal } from "../Modal";

const FolderManageModal = ({
  initialData = {},
  handleSubmit,
  onClose,
  eventType,
  folderId = null,
  handleDeleteUserPermission,
  isRoot,
}) => {
  const [error, setError] = useState(null);
  const [isOpenPermissionOptions, setOpenPermissionOptions] = useState(null);
  const [folderFields, setFolderFields] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    userURI: initialData.userURI || "",
    permissionLevel: initialData.permissionLevel || "",
  });
  const [userRights, setUserRights] = useState("");

  useEffect(() => {
    if (folderId) {
      const documentId = getLinkInfo(folderId, 2);
      getDocumentPermissions(documentId).then((permissionsList) => {
        permissionsList.forEach((perm) => {
          if (
            perm["http://example.cz/userUri"] ===
            localStorage.getItem("currentUserUri")
          ) {
            setUserRights(perm["http://example.cz/level"]);
          }
        });
      });
    }
  }, []);

  const handleInput = (event, key) => {
    setFolderFields({ ...folderFields, [key]: event.target.value });
  };

  const onSubmit = () => handleSubmit(folderFields);
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
            marginBottom: "10px",
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
        {eventType === "Edit" && isRoot && <div style={{marginBottom: '10px', textAlign: 'center'}}>Your access level is {userRights}</div>}

        {userRights === "SECURITY" && eventType === "Edit" && isRoot && (
          <div
            style={{
              textAlign: "center",
              cursor: "pointer",
              color: "#2196f3",
              // marginBottom: "10px",
            }}
            onClick={() => setOpenPermissionOptions(!isOpenPermissionOptions)}
          >
            Manage user permissions
          </div>
        )}
        {isOpenPermissionOptions && (
          <ManagePermissions
            initialData={initialData}
            folderId={folderId}
            handleDeleteUserPermission={handleDeleteUserPermission}
          />
        )}
      </div>
    </Modal>
  );
};

export { FolderManageModal };
