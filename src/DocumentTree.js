import React, { useEffect, useState } from "react";
import { FolderList } from "./components/FolderList";
import { Header } from "./components/Header";
import { Container, StyledDocumentTreeWrapper } from "./styled";
import { AddDocumentIcon } from "./components/AddDocumentIcon";
import { FileInfo } from "./components/FileInfo";
import { FolderManageModal } from "./components/FolderManageModal";
import { useDocuments, useAddRootFolder, useEditFolder, useDeleteFolder, useDelete, useAddFile } from "./features/document/hooks";
import { FileManageModal } from "./components/FileManageModal";
import { Modal } from "./components/Modal";

const initModalState = {
  folder: { isOpen: false, folderId: null, parentFolderId: null, isRoot: false, isEdit: false, isDelete: false, initialData: {}, fileAdd: false, file: null, fileName: null},
  // file: {isOpen: false, isFile: false, isAdd: false, isInfo: false, initialData: {}}

};

function DocumentTree() {
  const [modals, setModals] = useState(initModalState);
  // const [isOpenFileModal, setOpenFileModal] = useState(false);
  const [isOpenFileInfoModal, setOpenFileInfoModal] = useState(false);

  const [fileInfo, setFileInfo] = useState();

  const onClose = () => setModals(initModalState);
  
  const { documents, loading, error } = useDocuments();
  const { addRootFolder } = useAddRootFolder({ modals, onClose });
  const  { editFolder } = useEditFolder({ modals, onClose});
  const { handleDeleteEntity } = useDelete({ modals, onClose})
  const {handleAddFileFetcher} =  useAddFile({modals, onClose })

  // const handleAddFile = async () => {
  //   // if (selectedFolder.id) {
  //   //   const parentFolderName = getLinkInfo(selectedFolder.id, 2);
  //   //   const entityType = getLinkInfo(selectedFolder.id, 1);

  //   //   try {
  //   //     const _file = await addFile(
  //   //       entityType,
  //   //       parentFolderName
  //   //       // file,
  //   //       // uploadedFileName
  //   //     );
  //   //     setOpenFileModal(false);
  //   //   } catch (e) {}
  //   // }
  // };

  // const handleAddUserPermission = (
  //   id = newFolder.name.trim().replace(/\s/g, "")
  // ) => {
  //   addUserPermission(id, newFolder.permissionLevel, newFolder.userURI);
  // };
  
  if (error) {
    return <div>Error</div>;
  }

  if (loading || !documents) {
    return <div>Loading...</div>;
  }

  const isAuthorized = !!localStorage.getItem("token");
  console.log(modals)
  return (
    <Container>
      <Header isAuthorized={isAuthorized} />
      {!isAuthorized && (
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

      {isAuthorized && (
        <div>
          <h1
            style={{ marginLeft: "10%", display: "flex", alignItems: "center" }}
          >
            Directories
          </h1>


          {/* FOLDER */}

          {(modals.folder.isOpen) && (
            <FolderManageModal
              onClose={onClose}
              handleSubmit={modals.folder.isEdit ? editFolder : addRootFolder}
              initialData={modals.folder.initialData}
            />
          )}

          {(modals.folder.isDelete) && (
            <Modal
            onClose={onClose}
            handleSubmit={handleDeleteEntity}
            isDelete={modals.folder.isDelete}
            />
          )}

          {/* FILE */}

          {modals.folder.fileAdd && (
          <FileManageModal onClose={onClose} handleSubmit={handleAddFileFetcher} initialData={modals.folder.initialData}/>
          )}

          {isOpenFileInfoModal && <FileInfo fileInfo={fileInfo} />}


          <StyledDocumentTreeWrapper>
            <AddDocumentIcon
              onOpenAddModal={() =>
                setModals({
                  ...initModalState,
                  folder: {
                    isOpen: true,
                    folderId: null,
                    parentFolderId: null,
                    isRoot: true,
                    isEdit: false,
                    initialData: {}
                  },
                  file: {
                    isOpen: false,
                    isFile: false,
                    isAdd: false,
                    isInfo: false,
                    initialData: {}

                  }
                })
              }
            />
            <FolderList
              list={documents}
              setModals={setModals}
              // setOpenFileModal={setOpenFileModal}
              setOpenFileInfoModal={setOpenFileInfoModal}
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
