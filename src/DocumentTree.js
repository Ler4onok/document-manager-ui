import React, { useEffect, useState } from "react";
import {
  addFile,
  addFolder,
  addUserPermission,
  getDocumentList,
  getFileContent,
  getFiles,
  getFileVersions,
  update,
  updateFile,
} from "./features/document/index";
import { FolderList } from "./components/FolderList";
import { FullModal } from "./components/FullModal";
import { Header } from "./components/Header";
import {
  StyledApp,
  StyledDocumentTreeWrapper,
  StyledFileCharacteristic,
  StyledFileCharacteristicsWrapper,
  StyledFileInfo,
  StyledIcon,
  StyledVersionsHeader,
  StyledVersionsHeaderWrapper,
} from "./styled";
import { Modal } from "./components/Modal";
import {
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import plusIcon from "./assets/plus_blue.svg";
import downloadIcon from "./assets/download.svg";
import addVersionIcon from "./assets/plus_versions.svg";

function DocumentTree() {
  const [documentTree, setDocumentTree] = useState([]);

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

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState();
  const [isSelectedFile, setSelectedFile] = useState(false);
  const [fileVersions, setFileVersions] = useState([]);
  const [areVersionsOpen, setVersionsOpen] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState("");

  const [modifierModal, setModifierModal] = useState({
    editModal: { isOpen: false },
    addModal: { isOpen: false },
  });

  const [userPermission, setUserPermission] = useState("");
  const [isOpenAddUserPermission, setOpenAddUserPermission] = useState(false);

  const [error, setError] = useState(null);

  const handleInput = (event, key) => {
    setNewFolder({ ...newFolder, [key]: event.target.value });
  };

  useEffect(() => {
    getDocumentsContent();
  }, []);

  const getDocumentsContent = async () => {
    try {
      const documentTree = await getDocumentList();
      setDocumentTree(documentTree);
    } catch (error) {
    }
  };

  //part 1 - type of the file, part 2 - name of the file
  function getLinkInfo(link, part) {
    const url = new URL(link);
    return `${url.pathname.split("/")[part]}`;
  }

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
        setError(null);
        setOpenFolderModal(false);
      } catch (e) {
        setError("Such folder exists. Change the name, please");
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

  const handleFileUpdate = (updateType) => {
    setOpenFileModal(true);
    const fileName = getLinkInfo(fileInfo["@id"], 2);
    updateFile(file, fileName, updateType);
  };

  const handleAddFile = async () => {
    if (selectedFolder.id) {
      const parentFolderName = getLinkInfo(selectedFolder.id, 2);
      const entityType = getLinkInfo(selectedFolder.id, 1);

      try {
        const _file = await addFile(
          entityType,
          parentFolderName,
          file,
          uploadedFileName
        );
        setOpenFileModal(false);
      } catch (e) {
      }
    }
  };

  const handleFileUpload = (event) => {
    // var formData = new FormData();
    // formData.append(event.target.files[0])

    const file = event.target.files[0];

    setFile(file);
    setUploadedFileName(file.name);
    setSelectedFile(true);
  };

  // if (documentTree.length === 0) {
  //   return <div>Loading...</div>;
  // }


  const handleAddUserPermission = (id = newFolder.name.trim().replace(/\s/g, "")) => {
    addUserPermission(id, newFolder.permissionLevel, newFolder.userURI);
  };

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
          <div>
          <h1
            style={{ marginLeft: "10%", display: "flex", alignItems: "center", position: 'relative' }}
          >
            Documents
          </h1>
          <StyledIcon
              left="23%"
              top='19%'
              src={plusIcon}
              title="Add a new document"
              // style={{ position: "absolute", right: 20 }}
              onClick={() => {
                setOpenFolderModal(true);
                setNewFolder({ ...newFolder, type: "Document", event: "Add" });
              }}
            />
          </div>
          {isOpenFolderModal && (
            <Modal
              handleSubmit={
                newFolder.event === "Add" ? handleAddFolder : handleUpdate
              }
              setOpenModal={setOpenFolderModal}
              newObject={newFolder}
              header={`${newFolder.event} a ${newFolder.type.toLowerCase()}`}
            >
              <div className="modalContent" style={{ width: "89%" }}>
                {/* <h3 style={{ margin: "0", marginTop: "10px" }}>
                  {newFolder.type} Name
                </h3> */}
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
                  value={newFolder.name}
                  onChange={(event) => handleInput(event, "name")}
                />
                {/* <h3 style={{ margin: "0" }}>{newFolder.type} Description</h3> */}
                <TextField
                  style={{ width: "100%", marginBottom: "10px" }}
                  id="outlined-basic"
                  label="Document description"
                  variant="outlined"
                  // label="Folder Description"
                  value={newFolder.description}
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
                  onClick={() =>
                    setOpenAddUserPermission(!isOpenAddUserPermission)
                  }
                >
                  Add user permissions
                </div>
                {isOpenAddUserPermission && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      id="outlined-basic"
                      label="User URI"
                      variant="outlined"
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
                        value={userPermission}
                        onChange={(event) => {
                          handleInput(event, "permissionLevel");
                          setUserPermission(event.target.value);
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
                      onClick={() => handleAddUserPermission('Add')}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </Modal>
          )}

          {isOpenFileModal && (
            <Modal
              handleSubmit={handleAddFile}
              setOpenModal={setOpenFileModal}
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
              {isSelectedFile ? (
                <div>
                  <div>
                    {" "}
                    Filename:{" "}
                    <input
                      type="text"
                      value={uploadedFileName}
                      onChange={(event) =>
                        setUploadedFileName(event.target.value)
                      }
                    />
                  </div>
                  <div>Filetype: {file.type}</div>
                </div>
              ) : (
                <p>Select a file to show details</p>
              )}
            </Modal>
          )}

          {isOpenFileInfoModal && (
            <StyledFileInfo>
              <h1 style={{ margin: 0, color: "#2196f3" }}>File information</h1>
              <StyledFileCharacteristicsWrapper
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <StyledFileCharacteristic>
                  <b>File name</b>: {fileInfo["http://example.cz/name"]}
                </StyledFileCharacteristic>
                <StyledFileCharacteristic>
                  <b>File type</b>: {fileInfo["http://example.cz/fileType"]}
                </StyledFileCharacteristic>
                <StyledFileCharacteristic>
                  <b>File version</b>: {fileInfo["http://example.cz/version"]}
                </StyledFileCharacteristic>
              </StyledFileCharacteristicsWrapper>
              <StyledVersionsHeaderWrapper>
                <StyledVersionsHeader
                  onClick={async () => {
                    const _fileVersions = await getFileVersions(
                      getLinkInfo(fileInfo["@id"], 2)
                    );
                    const reversedFileVersions = _fileVersions
                      .map((version) => version)
                      .reverse();
                    setFileVersions(reversedFileVersions);
                    setVersionsOpen(!areVersionsOpen);
                  }}
                >
                  {areVersionsOpen ? "Hide" : "Show"} file versions
                </StyledVersionsHeader>
                <StyledIcon
                  src={addVersionIcon}
                  title="Add a new file version"
                  position="absolute"
                  right={0}
                  top="-3px"
                  transform="scale(0.6)"
                  onClick={() => {
                    handleFileUpdate("content");
                  }}
                />
              </StyledVersionsHeaderWrapper>
              {areVersionsOpen &&
                fileVersions.map((version, key) => (
                  <div
                    style={{
                      border: "solid 1px #80808029",
                      borderRadius: "10px",
                      padding: "15px",
                      margin: "5px",
                      width: "80%",
                      position: "relative",
                    }}
                  >
                    <div>
                      <div>{`Version ${version["http://example.cz/version"]}`}</div>
                      <div>{version["http://example.cz/fileName"]}</div>
                      <div>{version["http://example.cz/created"]}</div>
                      <div>{version["http://example.cz/fileType"]}</div>
                    </div>
                    <StyledIcon
                      right="5%"
                      top="40%"
                      src={downloadIcon}
                      onClick={async () => {
                        const fileName = getLinkInfo(fileInfo["@id"], 2);
                        const fileContent = await getFileContent(
                          fileName,
                          version["http://example.cz/version"]
                        );
                        const url = URL.createObjectURL(
                          new Blob([fileContent])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `${fileInfo["http://example.cz/fileName"]}`
                        );

                        document.body.appendChild(link);
                        link.click();
                        link.parentNode.removeChild(link);
                      }}
                    />
                  </div>
                ))}
            </StyledFileInfo>
            // <Modal
            //   setOpenModal={setOpenFileInfoModal}
            //   header="File information"
            // >
            //   <div>File name: {fileInfo["http://example.cz/fileName"]}</div>
            //   <div>File type: {fileInfo["http://example.cz/fileType"]}</div>
            //   <div>File version: {fileInfo["http://example.cz/version"]}</div>
            // </Modal>
          )}

          <StyledDocumentTreeWrapper>
           
            <FolderList
              list={documentTree}
              setOpenFolderModal={setOpenFolderModal}
              setOpenFileModal={setOpenFileModal}
              setOpenFileInfoModal={setOpenFileInfoModal}
              newFolder={newFolder}
              setNewFolder={setNewFolder}
              setFolderId={setSelectedFolder}
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
