import React, { useState, useEffect, useRef } from "react";
import { useTransition, animated, useSpring, config } from "react-spring";
import styled from "styled-components";

import {
  getSubfolders,
  deleteFolder,
  addFolder,
  getFiles,
  getFileInfo,
  getFileContent, deleteFile
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
import downloadIcon from '../../assets/download.svg'

const FolderList = ({
  list,
  setOpenFolderModal,
  setOpenFileModal,
  setOpenFileInfoModal,
  newFolder,
  setNewFolder,
  setFolderId,
  setFileInfo,
  setModifierModal,
  isRoot = false,
}) => {
  console.log(list);
  return (
    <div style={{ width: "fit-content" }}>
      {list.map((folder) => (
        <FolderItem
          key={folder["@id"]}
          folder={folder}
          isRoot={isRoot}
          setOpenFolderModal={setOpenFolderModal}
          setOpenFileModal={setOpenFileModal}
          setOpenFileInfoModal={setOpenFileInfoModal}
          newFolder={newFolder}
          setNewFolder={setNewFolder}
          setFolderId={setFolderId}
          setFileInfo={setFileInfo}
          setModifierModal={setModifierModal}
        />
      ))}
    </div>
  );
};

const FolderItem = ({
  folder,
  isRoot,
  setOpenFolderModal,
  setOpenFileModal,
  setOpenFileInfoModal,
  newFolder,
  setNewFolder,
  setFolderId,
  setFileInfo,
  setModifierModal,
}) => {
  const [folderContent, setFolderContent] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);

  const { opacity, transform } = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      // height:
      //   isRoot && isOpen
      //     ? "auto"
      //     : isOpen
      //     ? (folderContent.length + 1) * 25 + folderContent.length * 15
      //     : 25,
      opacity: 1,
      transform: `translate3d(0px,0,0)`,
    },
    config: config.stiff,
  });

  // console.log(height.startPosition);
  // console.log(folderContent.length);

  //part 1 - type of the file, part 2 - name of the file
  function getLinkInfo(link, part) {
    const url = new URL(link);
    return `${url.pathname.split("/")[part]}`;
  }

  const getSubfolderList = async () => {
    // const folderId = folder["@id"].replace(
    //   `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
    //   ""
    // );

    console.log("lalalall");

    const folderId = getLinkInfo(folder["@id"], 2);

    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }/subfolders?namespace=http://example.cz/Folder`;

    try {
      const _subfolderList = await getSubfolders(url);
      return _subfolderList;
    } catch (error) {
      console.error(error);
    }
  };

  const getFilesList = async (isRoot) => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }//files?namespace=http://example.cz/Folder`;

    try {
      const _filesList = await getFiles(url);
      console.log(_filesList);

      return _filesList;
    } catch (error) {
      console.error(error);
    }
  };

  const getFolderContent = async () => {
    try {
      const subfolders = await getSubfolderList();
      const files = await getFilesList(isRoot);
      setFolderContent(subfolders.concat(files));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFolder = async () => {
   await deleteFolder(getLinkInfo(folder["@id"], 2), isRoot);
  };

  const handleDeleteFile = async () => {
    await deleteFile(getLinkInfo(folder["@id"], 2));
  }


  useEffect(() => {
    getFolderContent();
    // getFiles();
  }, []);

  const onOpenFolder = (event) => {
    event.stopPropagation();
    if (folderContent.length > 0) setOpen(!isOpen);
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setOpacity(1);
  };

  const onMouseLeave = (e) => {
    e.stopPropagation();
    setOpacity(0);
  };

  const hasChildren = isOpen && folderContent.length > 0;
  // console.log(folder);
  return (
    <div>
      <StyledFolderItem
        style={{ opacity, transform }}
        isOpen={hasChildren}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ display: "flex" }}>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIcon src={folderIcon}/>
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIcon src={fileIcon}/>
          )}

          <div onClick={onOpenFolder}>{folder["http://example.cz/name"]}</div>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={addFolderIcon}
                title='Add a new folder'
                onClick={() => {
                  setOpenFolderModal(true);
                  setNewFolder({ ...newFolder, type: "Folder", event: 'Add' });
                  setFolderId({ id: folder["@id"], name: folder['http://example.cz/name'], description: folder['http://example.cz/description'], isRoot: isRoot });
                }}
              />
              <StyledIcon
                src={addFileIcon}
                title='Add a new file'
                onClick={() => {
                  setOpenFileModal(true);
                  setNewFolder({ ...newFolder, type: "File", event: 'Add' });
                  setFolderId({ id: folder["@id"],   name: folder['http://example.cz/name'], description: folder['http://example.cz/description'], isRoot: isRoot });
                }}
              />

              <StyledIcon
                src={editIcon}
                title='Edit a folder'
                onClick={() => {
                  setOpenFolderModal(true);
                  setNewFolder({name: folder['http://example.cz/name'] , description: folder['http://example.cz/description'],  type: getLinkInfo(folder["@id"], 1), event: 'Edit'});
                  setFolderId({ id: folder["@id"], name: folder['http://example.cz/name'], description: folder['http://example.cz/description'], isRoot: isRoot });
                }}
              />
              <StyledIcon
                src={deleteFolderIcon}
                title='Delete a folder'
                onClick={() => handleDeleteFolder()}
              />
            </StyledIconWrapper>
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={getFileInfoIcon}
                title='Open file info'
                onClick={async () => {
                  const fileInfo = await getFileInfo(
                    getLinkInfo(folder["@id"], 2)
                  );
                  setFileInfo(fileInfo);

                  // console.log(fileInfo);
                  setOpenFileInfoModal(true);
                }}
              />
              <StyledIcon src={downloadIcon} title='Download a file'onClick={async ()=>{
                const fileName = getLinkInfo(folder["@id"], 2);
                const fileContent = await getFileContent(fileName);
                const url = URL.createObjectURL(new Blob([fileContent]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  `${folder['http://example.cz/fileName']}`,
                );
            
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              }}/>
              <StyledIcon
                src={deleteFolderIcon}
                title='Delete a file'
                onClick={() => handleDeleteFile()}
              />
            </StyledIconWrapper>
          )}
        </div>
        {hasChildren && (
          <FolderList
            list={folderContent}
            setOpenFolderModal={setOpenFolderModal}
            setOpenFileModal={setOpenFileModal}
            setOpenFileInfoModal={setOpenFileInfoModal}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            setFolderId={setFolderId}
            setFileInfo={setFileInfo}
          />
        )}
      </StyledFolderItem>
    </div>
  );
};

export { FolderList };
