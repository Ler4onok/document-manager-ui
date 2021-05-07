import React, { useState, memo } from "react";

import {
  deleteFolder,
  getFileInfo,
  getFileContent,
  deleteFile,
} from "../../features/document";
import {
  StyledFolderItem,
  StyledIcon,
  StyledIconWrapper,
  StyledDocumentTreeWrapper,
} from "./styled";
import addFolderIcon from "./assets/add_folder.svg";
import addFileIcon from "./assets/add_file.svg";
import deleteFolderIcon from "./assets/delete_folder.svg";
import getFileInfoIcon from "./assets/info.svg";
import folderIcon from "./assets/folder_simple.svg";
import filledFolderIcon from "./assets/folder.svg";
import fileIcon from "./assets/file_simple.svg";
import editIcon from "./assets/edit.svg";
import downloadIcon from "../../assets/download.svg";
import { useFolderChildren, useFolderPermission } from "./hooks";
import { getLinkInfo } from "../../features/document/utils";
import { getDocumentPermissions } from "../../features/document/api";

const FolderList = ({
  rootLevel,
  list,
  setModals,
  // setOpenFileModal,
  setOpenFileInfoModal,
  setFileInfo,
  setModifierModal,
  isRoot = false,
  parentId=null
}) => {

  // const [userRights, setUserRights] = useState('')
  // console.log({parentId})

  // const getUserRights = (document) => {
  //   const documentId = getLinkInfo(document['@id'], 2)
  //   getDocumentPermissions(documentId).then(permissionsList => permissionsList.forEach((perm) => {
  //     if (
  //       perm["http://example.cz/userUri"] ===
  //       localStorage.getItem("currentUserUri")
  //     ) {
  //       return(perm["http://example.cz/level"])
  //       // setUserRights(perm["http://example.cz/level"]);
  //     }
  //   }))
  // }

  return (
    <div style={{ width: "fit-content" }}>
      {list.map((document) => (
        <FolderItem
          rootLevel={rootLevel}
          key={document? document["@id"]: ''}
          folder={document}
          isRoot={isRoot}
          setModals={setModals}
          setOpenFileInfoModal={setOpenFileInfoModal}
          setFileInfo={setFileInfo}
          parentId={parentId}
        />
      ))}
    </div>
  );
};

const FolderItem = memo(({
  rootLevel,
  folder,
  isRoot,
  setModals,
  // setOpenFileModal,
  setOpenFileInfoModal,
  setFileInfo,
  parentId
}) => {
  const { folderChilds } = useFolderChildren({ isRoot, folder });
  const { level } = useFolderPermission({ isRoot, document: folder });

  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);
  const [currentFolder, setCurrentFolder] = useState(folder);

  const handleDeleteFolder = async () => {
    await deleteFolder(getLinkInfo(folder["@id"], 2), isRoot);
  };

  const handleDeleteFile = async () => {
    await deleteFile(getLinkInfo(folder["@id"], 2));
  };

  // const onOpenFolder = (event) => {
  //   event.stopPropagation();
  //   if (folderChilds.length > 0) setOpen(!isOpen);
  // };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setOpacity(1);
  };

  const onMouseLeave = (e) => {
    e.stopPropagation();
    setOpacity(0);
  };

  const isFolder = getLinkInfo(folder["@id"], 1) === "Folder" || getLinkInfo(folder["@id"], 1) === "Document";

  const isFilledFolder = isFolder && folderChilds.length > 0;

  const renderFolderOrFileIcon = () => {
    if (isFolder) {
      if (isFilledFolder) {
        return <StyledIcon src={filledFolderIcon} />;
      } 

      return <StyledIcon src={folderIcon} />;
    };

    return <StyledIcon src={fileIcon} />;
  } 

  const hasChildren = isOpen && folderChilds.length > 0;
  return (
    <div>
      <StyledFolderItem
        isOpen={hasChildren}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ display: "flex" }}>
          {renderFolderOrFileIcon()}
          <div onClick={(event) => {
              console.log(folder)
              event.stopPropagation();
              if (folderChilds.length > 0) setOpen(!isOpen);
              setCurrentFolder(folder);
              console.log(currentFolder)
          }}>{folder["http://example.cz/name"]}</div>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={addFolderIcon}
                title="Add a new folder"
                onClick={() => {
                  if (level === 'READ' || level === 'NONE' || rootLevel === 'READ' || rootLevel === 'NONE') {
                    alert('You do not have permissions for this');
                    return;
                  }

                  setModals({
                    folder: {
                      isOpen: true,
                      folderId: null,
                      parentFolderId: folder["@id"] || null,
                      isEdit: false,
                      isRoot,
                      initialData: {},
                    },
                  });
                }}
              />
              <StyledIcon
                src={addFileIcon}
                title="Add a new file"
                onClick={() => {
                  if (level === 'READ' || level === 'NONE' || rootLevel === 'READ' || rootLevel === 'NONE') {
                    alert('You do not have permissions for this');
                    return;
                  }
                  setModals({
                    folder: {
                      isOpen: false,
                      folderId: folder['@id'],
                      parentFolderId: isRoot? null : folder['http://example.cz/parentFolder']["@id"],
                      isRoot,
                      fileAdd: true,
                      updateType: null
                    },
                    file: {
                      isOpen: true,
                      isAdd: true,
                    }
                  });
                }
              }
              />

              <StyledIcon
                src={editIcon}
                title="Edit a folder"
                onClick={() => {
                  console.log(level)
                  if (level === 'READ' || level === 'NONE' || rootLevel === 'READ' || rootLevel === 'NONE') {
                    alert('You do not have permissions for this');
                    return;
                  }
                  setModals({
                    folder: {
                      isOpen: true,
                      folderId: folder['@id'],
                      parentFolderId: isRoot? null : folder['http://example.cz/parentFolder']["@id"],
                      isEdit: true,
                      isRoot,
                      initialData: {
                        name: folder["http://example.cz/name"],
                        description: folder["http://example.cz/description"],
                      },
                    },
                  });
                }}
              />
              <StyledIcon
                src={deleteFolderIcon}
                title="Delete a folder"
                onClick={() => {
                  if (level === 'READ' || level === 'NONE' || rootLevel === 'READ' || rootLevel === 'NONE') {
                    alert('You do not have permissions for this');
                    return;
                  }
                  setModals({
                    folder: {
                      isOpen: false,
                      folderId: folder['@id'],
                      parentFolderId: isRoot? null : folder['http://example.cz/parentFolder']["@id"],
                      isEdit: false,
                      isDelete: true,
                      isRoot,
                      initialData: {
                        name: folder["http://example.cz/name"],
                        description: folder["http://example.cz/description"],
                      },
                    },
                    file: {
                      isFile: false
                    }
                  });
                }}              />
            </StyledIconWrapper>
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={getFileInfoIcon}
                title="Open file info"
                onClick={async () => {
                  setModals({
                    folder: {
                      userLevel: rootLevel
                    }
                  })
                  const fileInfo = await getFileInfo(
                    getLinkInfo(folder["@id"], 2)
                  );
                  
                  setFileInfo(fileInfo);
                  setOpenFileInfoModal(true);
                }}
              />
              <StyledIcon
                src={downloadIcon}
                title="Download a file"
                onClick={async () => {
                  const fileName = getLinkInfo(folder["@id"], 2);
                  const fileContent = await getFileContent(fileName);
                  const url = URL.createObjectURL(new Blob([fileContent]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    `${folder["http://example.cz/fileName"]}`
                  );

                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                }}
              />
              <StyledIcon
                src={deleteFolderIcon}
                title="Delete a file"
                onClick={() => {
                  if (level === 'READ' || level === 'NONE' || rootLevel === 'READ' || rootLevel === 'NONE') {
                    alert('You do not have permissions for this');
                    return;
                  }
                  setModals({
                    folder: {
                      isOpen: false,
                      folderId: folder['@id'],
                      parentFolderId: parentId,
                      isEdit: false,
                      isDelete: true,
                      isRoot,
                      initialData: {
                        name: folder["http://example.cz/name"],
                        description: folder["http://example.cz/description"],
                      },
                    },
                    file: {
                      isFile: true
                    }
                  });
                }}
              />
            </StyledIconWrapper>
          )}
        </div>
        {hasChildren && (
          <FolderList
            rootLevel={level}
            list={folderChilds}
            // setOpenFileModal={setOpenFileModal}
            setOpenFileInfoModal={setOpenFileInfoModal}
            setFileInfo={setFileInfo}
            setModals={setModals}
            parentId={folder['@id']}
          />
        )}
      </StyledFolderItem>
    </div>
  );
});

export { FolderList };
