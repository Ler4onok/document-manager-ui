import React, { useEffect, useState } from "react";
import { FolderList } from "./components/FolderList";
import { Header } from "./components/Header";
import { Container, StyledDocumentTreeWrapper } from "./styled";
import { AddDocumentIcon } from "./components/AddDocumentIcon";
import { FileInfo } from "./components/FileInfo";
import { FolderManageModal } from "./components/FolderManageModal";
import { useDocuments, useAddRootFolder, useEditFolder, useDeleteFolder, useDelete, useAddFile, useUpdateFile } from "./features/document/hooks";
import { FileManageModal } from "./components/FileManageModal";
import { Modal } from "./components/Modal";
import { getLinkInfo } from "./features/document/utils";
import { deleteUserPermission } from "./features/document/api";

const initModalState = {
  folder: { isOpen: false, folderId: null, parentFolderId: null, isRoot: false, isEdit: false, current: null,
  isDelete: false, initialData: {}, fileAdd: false, file: null, fileName: null, updateType:null, fileInfo:''},
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
  const {handleUpdateFileFetcher} = useUpdateFile({modals, onClose})

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

  const handleDeleteUserPermission =  (id) => {
    const permissionId = getLinkInfo(id, 2)
    deleteUserPermission(permissionId) 
  }
  
  if (error) {
    return <div>Error</div>;
  }

  if (loading || !documents) {
    return <div>Loading...</div>;
  }

  const isAuthorized = !!localStorage.getItem("token");
  console.log(modals.folder)
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
          <div style={{display: 'flex', alignItems:'center'}}>
          <h1
            style={{ marginLeft: "10%", display: "flex", alignItems: "center" }}
          >
            Documents
          </h1>
          <AddDocumentIcon
              onOpenAddModal={() =>
                setModals({
                  ...initModalState,
                  folder: {
                    current: null,
                    isOpen: true,
                    folderId: null,
                    parentFolderId: null,
                    isRoot: true,
                    isEdit: false,
                    initialData: {},
                    updateType: null,
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

          </div>

          

          {/* FOLDER */}

          {(modals.folder.isOpen) && (
            <FolderManageModal
              onClose={onClose}
              handleSubmit={modals.folder.isEdit ? editFolder : addRootFolder}
              initialData={modals.folder.initialData}
              eventType={modals.folder.isEdit ? 'Edit' : 'Add'}
              folderId={modals.folder.folderId}
              handleDeleteUserPermission={handleDeleteUserPermission}
            />
          )}

          {(modals.folder.isDelete) && (
            <Modal
            onClose={onClose}
            handleSubmit={handleDeleteEntity}
            isDelete={modals.folder.isDelete}
            header='Delete the entity'
            ><div>Do you want to delete this entity?</div></Modal>
          )}

          {/* FILE */}

          {modals.folder.fileAdd && (
          <FileManageModal onClose={onClose} handleSubmit={!modals.folder.updateType? handleAddFileFetcher: handleUpdateFileFetcher} initialData={modals.folder.initialData}/>
          )}

          {isOpenFileInfoModal && <FileInfo fileInfo={fileInfo} setModals={setModals}/>}


          <StyledDocumentTreeWrapper>
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
