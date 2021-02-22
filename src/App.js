import React, { useEffect, useState } from "react";
import { addFile, addFolder, getDocumentList } from "./features/document/index";
import { FolderList } from "./components/DocumentTree";
import { Header } from "./components/Header";
import { StyledApp, StyledDocumentTreeWrapper } from "./styled";
import { Modal } from "./components/Modal";
import { TextField } from "@material-ui/core";

function App() {
  const [documentTree, setDocumentTree] = useState([]);

  const [isOpenFolderModal, setOpenFolderModal] = useState(false);
  const [isOpenFileModal, setOpenFileModal] = useState(false);
  const [isOpenFileInfoModal, setOpenFileInfoModal] = useState(false);

  const [folderId, setFolderId] = useState({});
  const [newFolder, setNewFolder] = useState({ name: "", description: "" });
  const [file, setFile] = useState();
  const [fileInfo, setFileInfo] = useState();
  const [isSelectedFile, setSelectedFile] = useState(false);

  console.log(file);

  const handleInput = (event, isName) => {
    isName
      ? setNewFolder({ ...newFolder, name: event.target.value })
      : setNewFolder({ ...newFolder, description: event.target.value });
    console.log(newFolder);
  };

  const getDocuments = async () => {
    const documentTree = await getDocumentList();
    setDocumentTree(documentTree);
    console.log(documentTree);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  function getLinkName(link) {
    const url = new URL(`${folderId.id}`);
    return `${url.pathname.split("/")[2]}`;
  }

  const handleAddFolder = async (newFolder) => {
    const parentFolderName = getLinkName(folderId.id);

    // const type = url.substr(0, url.indexOf("/"));
    console.log(parentFolderName);
    try {
      const newF = await addFolder(
        "Folder",
        newFolder.name,
        newFolder.description,
        parentFolderName,
        folderId.isRoot
      );
      console.log(newF);
    } catch (e) {
      console.log("Cannot add a folder. Reason: " + e);
    }

    setOpenFolderModal(false);

    // const newFolder = await addFolder("Document", name);
    // console.log(newFolder);
  };

  const handleAddFile = async () => {
    console.log(folderId);
    const parentFolderName = getLinkName(folderId.id);
    console.log(parentFolderName);

    try {
      const _file = await addFile(parentFolderName, file);
      console.log(_file);
    } catch (e) {
      console.log("Cannot add a folder. Reason: " + e);
    }

    setOpenFolderModal(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    setFile(file);
    setSelectedFile(true);
  };

  if (documentTree.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <StyledApp>
      <Header />
      <h1 style={{ marginLeft: "10%" }}>Directories</h1>
      {isOpenFolderModal && (
        <Modal
          handleAdd={handleAddFolder}
          setOpenModal={setOpenFolderModal}
          newObject={newFolder}
          header="Add a new folder"
        >
          <div className="modalContent" style={{ width: "89%" }}>
            <h3 style={{ margin: "0", marginTop: "10px" }}>Folder Name</h3>
            <TextField
              style={{ width: "100%", marginBottom: "10px" }}
              id="standard-basic"
              // label="Folder Name"
              value={newFolder.name}
              onChange={(event) => handleInput(event, true)}
            />
            <h3 style={{ margin: "0" }}>Folder Description</h3>
            <TextField
              style={{ width: "100%" }}
              id="standard-basic"
              // label="Folder Description"
              value={newFolder.description}
              onChange={(event) => handleInput(event, false)}
            />
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
                lastModifiedDate: {file.lastModifiedDate.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>Select a file to show details</p>
          )}
        </Modal>
      )}

      {isOpenFileInfoModal && (
        <Modal setOpenModal={setOpenFileInfoModal} header="File information">
          {console.log(fileInfo)}
          <div>File name: {fileInfo["http://example.cz/fileName"]}</div>
          <div>File type: {fileInfo["http://example.cz/fileType"]}</div>
          <div>File version: {fileInfo["http://example.cz/version"]}</div>
        </Modal>
      )}

      <StyledDocumentTreeWrapper>
        <FolderList
          list={documentTree}
          setOpenFolderModal={setOpenFolderModal}
          setOpenFileModal={setOpenFileModal}
          setOpenFileInfoModal={setOpenFileInfoModal}
          setFolderId={setFolderId}
          setFileInfo={setFileInfo}
          isRoot={true}
        />
      </StyledDocumentTreeWrapper>
    </StyledApp>
  );
}

export default App;
