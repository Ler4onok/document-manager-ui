import React, { useEffect, useState } from "react";
import { FolderList } from "./components/FolderList";
import { Header } from "./components/Header";
import { Container, StyledDocumentTreeWrapper } from "./styled";
import { AddDocumentIcon } from "./components/AddDocumentIcon";
import { FileInfo } from "./components/FileInfo";
import { FolderManageModal } from "./components/FolderManageModal";
import { useDocuments, useAddRootFolder } from "./features/document/hooks";
import { FileManageModal } from "./components/FileManageModal";

const initModalState = {
  folder: { isOpen: false, parentFolderId: null, isRoot: false, isEdit: false, initialData: {} },
};

function DocumentTree() {
  const [modals, setModals] = useState(initModalState);
  const [isOpenFileModal, setOpenFileModal] = useState(false);
  const [isOpenFileInfoModal, setOpenFileInfoModal] = useState(false);

  const [fileInfo, setFileInfo] = useState();

  const onClose = () => setModals(initModalState);
  
  const { documents, loading, error } = useDocuments();
  const { addRootFolder } = useAddRootFolder({ modals, onClose });

  const handleAddFile = async () => {
    // if (selectedFolder.id) {
    //   const parentFolderName = getLinkInfo(selectedFolder.id, 2);
    //   const entityType = getLinkInfo(selectedFolder.id, 1);

    //   try {
    //     const _file = await addFile(
    //       entityType,
    //       parentFolderName
    //       // file,
    //       // uploadedFileName
    //     );
    //     setOpenFileModal(false);
    //   } catch (e) {}
    // }
  };

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
          {(modals.folder.isOpen) && (
            <FolderManageModal
              onClose={onClose}
              handleSubmit={addRootFolder}
              initialData={modals.folder.initialData}
            />
          )}
          {isOpenFileModal && (
            <FileManageModal onClose={() => setOpenFileModal(false)} />
          )}
          {isOpenFileInfoModal && <FileInfo fileInfo={fileInfo} />}
          <StyledDocumentTreeWrapper>
            <AddDocumentIcon
              onOpenAddModal={() =>
                setModals({
                  ...initModalState,
                  folder: {
                    isOpen: true,
                    parentFolderId: null,
                    isRoot: true,
                    isEdit: false,
                    initialData: {}
                  },
                })
              }
            />
            <FolderList
              list={documents}
              setModals={setModals}
              setOpenFileModal={setOpenFileModal}
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
