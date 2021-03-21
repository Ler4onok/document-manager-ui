import React, { useState } from "react";
import {
  addFile,
  addFolder,
  addUserPermission,
  update,
  updateFile,
} from "./features/document";
import { FolderList } from "./components/FolderList";
import { Header } from "./components/Header";
import { Container, StyledDocumentTreeWrapper } from "./styled";
import { AddDocumentIcon } from "./components/AddDocumentIcon";
import { FileInfo } from "./components/FileInfo";
import { FolderManageModal } from "./components/FolderManageModal";
import { useDocuments } from "./features/document/hooks";
import { getLinkInfo } from "./features/document/utils";
import { FileManageModal } from "./components/FileManageModal";

function DocumentTree() {
  const [isOpenFolderModal, setOpenFolderModal] = useState(false);
  const [isOpenFileModal, setOpenFileModal] = useState(false);
  const [isOpenFileInfoModal, setOpenFileInfoModal] = useState(false);
  
  const [selectedFolder, setSelectedFolder] = useState({});
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
    type: "",
    userURI: "",
    permissionLevel: "",
    event: "",
  });
  
  const [fileInfo, setFileInfo] = useState();
  const { documents, loading, error } = useDocuments();
  
  const handleAddFolder = async (newFolder) => {
    if (newFolder.type === "Document") {
      try {
        const newF = await addFolder(
          newFolder.type,
          newFolder.name,
          newFolder.description,
          selectedFolder.isRoot
        );
        setOpenFolderModal(false);
        handleAddUserPermission()
      } catch (e) {
      }
    } else {
      const parentFolderName = getLinkInfo(selectedFolder.id, 2);
      try {
        const newF = await addFolder(
          newFolder.type,
          newFolder.name,
          newFolder.description,
          selectedFolder.isRoot,
          parentFolderName
        );
        // setError(null);
        setOpenFolderModal(false);
      } catch (e) {
        // setError("Such folder exists. Change the name, please");
      }
    }
  };

  const getEndpointInfo = (entityType) => {
    switch (entityType) {
      case "Document":
        return "documents";
      case "Folder":
        return "folders";
      default:
        return "files";
    }
  };

  const handleUpdate = async () => {
    const id = getLinkInfo(selectedFolder["id"], 2);
    const reqType = getEndpointInfo(newFolder.type);
    const url = `${reqType}/${id}?namespace=http://example.cz/${newFolder.type}`;

    await update(url, id, newFolder);
    handleAddUserPermission(id)
    setNewFolder({ ...newFolder, name: "", description: "" });
  };

  const handleAddFile = async () => {
    if (selectedFolder.id) {
      const parentFolderName = getLinkInfo(selectedFolder.id, 2);
      const entityType = getLinkInfo(selectedFolder.id, 1);

      try {
        const _file = await addFile(
          entityType,
          parentFolderName,
          // file,
          // uploadedFileName
        );
        setOpenFileModal(false);
      } catch (e) {
      }
    }
  };

  const handleAddUserPermission = (id = newFolder.name.trim().replace(/\s/g, "")) => {
    addUserPermission(id, newFolder.permissionLevel, newFolder.userURI);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <Container>
      <Header isAuthorized={localStorage.getItem("token") !== null} />

      {localStorage.getItem("token") === null && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "80px",
          }}
        >
          <h1>Welcome to document manager</h1>
          <h2>
            Please,{" "}
            <a href="https://kbss.felk.cvut.cz/authorization-service/?tenant=http://example.org/tenants/document-manager&redirectTo=http://localhost:3000/auth">
              log in
            </a>
          </h2>
        </div>
      )}

      {localStorage.getItem("token") && (
        <div>
          <h1
            style={{ marginLeft: "10%", display: "flex", alignItems: "center" }}
          >
            Directories
          </h1>
          {isOpenFolderModal && (
            <FolderManageModal
              onClose={() => setOpenFolderModal(false)}
            />
          )}
          {isOpenFileModal && (
            <FileManageModal
              onClose={() => setOpenFileModal(false)}
            />
          )}
          {isOpenFileInfoModal && (
            <FileInfo fileInfo={fileInfo} />
          )}
          <StyledDocumentTreeWrapper>
            <AddDocumentIcon />
            <FolderList
              list={documents}
              setOpenFolderModal={setOpenFolderModal}
              setOpenFileModal={setOpenFileModal}
              setOpenFileInfoModal={setOpenFileInfoModal}
              newFolder={newFolder}
              setNewFolder={setNewFolder}
              setFolderId={setSelectedFolder}
              setFileInfo={setFileInfo}
              isRoot={true}
            />
          </StyledDocumentTreeWrapper>
        </div>
      )}
    </Container>
  );
}

export default DocumentTree;
