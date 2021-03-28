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
import fileIcon from "./assets/file_simple.svg";
import editIcon from "./assets/edit.svg";
import downloadIcon from "../../assets/download.svg";
import { useFolderChildren } from "./hooks";
import { getLinkInfo } from "../../features/document/utils";

const FolderList = ({
  list,
  setModals,
  setOpenFileModal,
  setOpenFileInfoModal,
  setFileInfo,
  setModifierModal,
  isRoot = false,
}) => {
  console.log(list)
  return (
    <div style={{ width: "fit-content" }}>
      {list.map((folder) => (
        <FolderItem
          key={folder["@id"]}
          folder={folder}
          isRoot={isRoot}
          setModals={setModals}
          setOpenFileModal={setOpenFileModal}
          setOpenFileInfoModal={setOpenFileInfoModal}
          setFileInfo={setFileInfo}
        />
      ))}
    </div>
  );
};

const FolderItem = memo(({
  folder,
  isRoot,
  setModals,
  setOpenFileModal,
  setOpenFileInfoModal,
  setFileInfo,
}) => {
  const { folderChilds } = useFolderChildren({ isRoot, folder })

  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);

  const handleDeleteFolder = async () => {
    await deleteFolder(getLinkInfo(folder["@id"], 2), isRoot);
  };

  const handleDeleteFile = async () => {
    await deleteFile(getLinkInfo(folder["@id"], 2));
  };

  const onOpenFolder = (event) => {
    event.stopPropagation();
    if (folderChilds.length > 0) setOpen(!isOpen);
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setOpacity(1);
  };

  const onMouseLeave = (e) => {
    e.stopPropagation();
    setOpacity(0);
  };

  const hasChildren = isOpen && folderChilds.length > 0;

  return (
    <div>
      <StyledFolderItem
        isOpen={hasChildren}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ display: "flex" }}>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIcon src={folderIcon} />
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIcon src={fileIcon} />
          )}

          <div onClick={onOpenFolder}>{folder["http://example.cz/name"]}</div>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={addFolderIcon}
                title="Add a new folder"
                onClick={() => {
                  setModals({
                    folder: {
                      isOpen: true,
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
                  // setOpenFileModal(true);
                }}
              />

              <StyledIcon
                src={editIcon}
                title="Edit a folder"
                onClick={() => {
                  setModals({
                    folder: {
                      isOpen: true,
                      parentFolderId: folder["@id"] || null,
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
                onClick={() => handleDeleteFolder()}
              />
            </StyledIconWrapper>
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={getFileInfoIcon}
                title="Open file info"
                onClick={async () => {
                  const fileInfo = await getFileInfo(
                    getLinkInfo(folder["@id"], 2)
                  );
                  setFileInfo(fileInfo);

                  // console.log(fileInfo);
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
                onClick={() => handleDeleteFile()}
              />
            </StyledIconWrapper>
          )}
        </div>
        {hasChildren && (
          <FolderList
            list={folderChilds}
            setOpenFileModal={setOpenFileModal}
            setOpenFileInfoModal={setOpenFileInfoModal}
            setFileInfo={setFileInfo}
            setModals={setModals}
          />
        )}
      </StyledFolderItem>
    </div>
  );
});

export { FolderList };
