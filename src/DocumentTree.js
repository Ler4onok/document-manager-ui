import React, { useEffect, useState } from "react";
import {
  addFile,
  addFolder,
  getDocumentList,
  getFiles,
  update
} from "./features/document/index";
import { FolderList } from "./components/DocumentTree";
import { FullModal } from "./components/FullModal";
import { Header } from "./components/Header";
import { StyledApp, StyledDocumentTreeWrapper, StyledIcon } from "./styled";
import { Modal } from "./components/Modal";
import { TextField } from "@material-ui/core";
import plusIcon from "./assets/plus_blue.svg";

function DocumentTree() {
  const [documentTree, setDocumentTree] = useState([]);

  const [isOpenFolderModal, setOpenFolderModal] = useState(false);
  const [isOpenFileModal, setOpenFileModal] = useState(false);
  const [isOpenFileInfoModal, setOpenFileInfoModal] = useState(false);

  const [folderId, setFolderId] = useState({});
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
    type: "",
    event: ''
  });

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState();
  const [isSelectedFile, setSelectedFile] = useState(false);

  const [modifierModal, setModifierModal] = useState({
    editModal: { isOpen: false },
    addModal: { isOpen: false },
  });

  const [error, setError] = useState(null);

  const handleInput = (event, isName) => {
    isName
      ? setNewFolder({ ...newFolder, name: event.target.value })
      : setNewFolder({ ...newFolder, description: event.target.value });

    console.log(newFolder);
  };

  useEffect(() => {
    getDocumentsContent();
  }, []);

  const getDocumentsContent = async () => {
    try {
      const documentTree = await getDocumentList();

      console.log(folderId);

      // const url = `folders/${folder}/files?namespace=http://example.cz/Folder`;
      // const files = getFiles()
      setDocumentTree(documentTree);

      //save the initial state
      // setDocumentList(documentTree);
    } catch (error) {
      console.log(error);
    }
  };

  function getLinkName(link) {
    const url = new URL(`${folderId.id}`);
    return `${url.pathname.split("/")[2]}`;
  }

  const handleAddFolder = async (newFolder) => {
    if (newFolder.type === "Document") {
      try {
        const newF = await addFolder(
          newFolder.type,
          newFolder.name,
          newFolder.description,
          folderId.isRoot
        );
        console.log(newF);
        setOpenFolderModal(false);
      } catch (e) {
        console.log("Cannot add a document. Reason: " + e);
      }
    } else {
      const parentFolderName = getLinkName(folderId.id);
      console.log(parentFolderName);
      try {
        const newF = await addFolder(
          newFolder.type,
          newFolder.name,
          newFolder.description,
          folderId.isRoot,
          parentFolderName
        );
        console.log(newF);
        setError(null);
        setOpenFolderModal(false);
      } catch (e) {
        setError("Such folder exists. Change the name, please");
        console.log("Cannot add a folder. Reason: " + e);
      }
    } 
  };

  const getEndpointInfo = (entityType) => {
    switch(entityType){
      case('Document'):
        return 'documents';
      case('Folder'):
        return 'folders';
      default:
        return 'files'
    }   
  }



  const handleUpdate = async () => {
    const id = getLinkName(folderId, 2);
    const reqType = getEndpointInfo(newFolder.type);
    const url = `${reqType}/${id}?namespace=http://example.cz/${newFolder.type}`
    await update(url, id, newFolder);
  }

  const handleAddFile = async () => {
    console.log(folderId);
    const parentFolderName = getLinkName(folderId.id);
    console.log(parentFolderName);

    try {
      const _file = await addFile(parentFolderName, file);
      console.log(_file);
      setOpenFileModal(false);
    } catch (e) {
      console.log("Cannot add a folder. Reason: " + e);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);

    setFile(file);
    setSelectedFile(true);
  };

  // if (documentTree.length === 0) {
  //   return <div>Loading...</div>;
  // }

  console.log(documentTree);

  return (
    <StyledApp>
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
          <h1 style={{ marginLeft: "10%" }}>Directories</h1>
          {isOpenFolderModal && (
            <Modal
              handleSubmit={newFolder.event === 'add'? handleAddFolder: handleUpdate}
              setOpenModal={setOpenFolderModal}
              newObject={newFolder}
              header={`Add a new ${newFolder.type.toLowerCase()}`}
            >
              <div className="modalContent" style={{ width: "89%" }}>
                <h3 style={{ margin: "0", marginTop: "10px" }}>
                  {newFolder.type} Name
                </h3>
                <TextField
                  style={{ width: "100%", marginBottom: "10px" }}
                  id="standard-basic"
                  // label="Folder Name"
                  value={newFolder.name}
                  onChange={(event) => handleInput(event, true)}
                />
                <h3 style={{ margin: "0" }}>{newFolder.type} Description</h3>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  // label="Folder Description"
                  value={newFolder.description}
                  onChange={(event) => handleInput(event, false)}
                />
                {error != null && <div style={{ color: "red" }}>{error}</div>}
              </div>
            </Modal>
          )}

          {isOpenFileModal && (
            <Modal
              handleAdd={handleAddFile}
              setOpenModal={setOpenFileModal}
              header="Add a new file"
              // newObject={newFile}
            >
              <input
                type="file"
                name="file"
                onChange={handleFileUpload}
                style={{ marginTop: "10px" }}
              />
              {isSelectedFile ? (
                <div>
                  <p>Filename: {file.name}</p>
                  <p>Filetype: {file.type}</p>
                  <p>Size in bytes: {file.size}</p>
                  <p>
                    lastModifiedDate:{" "}
                    {file.lastModifiedDate.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p>Select a file to show details</p>
              )}
            </Modal>
          )}

          {isOpenFileInfoModal && (
            <Modal
              setOpenModal={setOpenFileInfoModal}
              header="File information"
            >
              {console.log(fileInfo)}
              <div>File name: {fileInfo["http://example.cz/fileName"]}</div>
              <div>File type: {fileInfo["http://example.cz/fileType"]}</div>
              <div>File version: {fileInfo["http://example.cz/version"]}</div>
            </Modal>
          )}

          <StyledDocumentTreeWrapper>
            <StyledIcon
              src={plusIcon}
              // style={{ position: "absolute", right: 20 }}
              onClick={() => {
                setOpenFolderModal(true);
                setNewFolder({ ...newFolder, type: "Document" });
              }}
            />

            <FolderList
              list={documentTree}
              setOpenFolderModal={setOpenFolderModal}
              setOpenFileModal={setOpenFileModal}
              setOpenFileInfoModal={setOpenFileInfoModal}
              newFolder={newFolder}
              setNewFolder={setNewFolder}
              setFolderId={setFolderId}
              setFileInfo={setFileInfo}
              setModifierModal={setModifierModal}
              isRoot={true}
            />
          </StyledDocumentTreeWrapper>
        </div>
      )}
    </StyledApp>
  );
}

export default DocumentTree;
