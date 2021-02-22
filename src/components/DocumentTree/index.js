import React, { useState, useEffect, useRef } from "react";
import { useTransition, animated, useSpring, config } from "react-spring";
import styled from "styled-components";

import {
  getSubfolders,
  deleteFolder,
  addFolder,
  getFiles,
  getFileInfo,
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
import { Modal } from "../Modal";

const FolderItemWrapper = styled(animated.div)``;

const FolderList = ({
  list,
  setOpenFolderModal,
  setOpenFileModal,
  setOpenFileInfoModal,
  setFolderId,
  setFileInfo,
  isRoot = false,
}) => {
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
          setFolderId={setFolderId}
          setFileInfo={setFileInfo}
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
  setFolderId,
  setFileInfo,
}) => {
  const [folderContent, setFolderContent] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);

  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height:
        isRoot && isOpen
          ? "auto"
          : isOpen
          ? (folderContent.length + 1) * 25 + folderContent.length * 15
          : 25,
      opacity: 1,
      transform: `translate3d(0px,0,0)`,
    },
    config: config.stiff,
  });

  //part 1 - type of the file, part 2 - name of the file
  function getLinkInfo(link, part) {
    const url = new URL(link);
    return `${url.pathname.split("/")[part]}`;
  }

  const getSubfolderList = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }/subfolders?namespace=http://example.cz/Folder`;

    try {
      const _subfolderList = await getSubfolders(url);
      console.log(_subfolderList);
      return _subfolderList;
    } catch (error) {
      console.error(error);
    }
  };

  const getFilesList = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    const url = `folders/${folderId}/files?namespace=http://example.cz/Folder`;

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

      let files = [];

      if (!isRoot) {
        files = await getFilesList();
      }
      // console.log("files");
      // console.log(subfolders.concat(files));
      // console.log(getLinkType(subfolders.concat(files)[0]["@id"]));
      setFolderContent(subfolders.concat(files));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFolder = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    console.log(folderId);
    // console.log(folderId);
    console.log(deleteFolder(folderId, isRoot));

    // handleDeleteFolder(folderId);
  };

  // const getFileInfo = async (fileName) => {
  //   const fileInfo = getFileInfo
  // };

  //UPDATE THE SUBFOLDER LIST AFTER DELETE
  // const handleDeleteFolder = (folderId) => {
  //   console.log({ folderId });
  //   // console.log(folderContent);
  //   const updatedSubfolderList = folderContent.filter(
  //     (subfolder) => subfolder !== folderId
  //   );
  //   console.log(updatedSubfolderList);
  //   setSubfolderList(updatedSubfolderList);
  // };

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

  return (
    <div>
      <StyledFolderItem
        style={{ height, opacity, transform }}
        isOpen={hasChildren}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{ display: "flex" }}>
          <div onClick={onOpenFolder}>{folder["http://example.cz/name"]}</div>
          {(getLinkInfo(folder["@id"], 1) === "Folder" ||
            getLinkInfo(folder["@id"], 1) === "Document") && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={addFolderIcon}
                onClick={() => {
                  setOpenFolderModal(true);
                  setFolderId({ id: folder["@id"], isRoot: isRoot });
                }}
              />
              <StyledIcon
                src={addFileIcon}
                onClick={() => {
                  setFolderId({ id: folder["@id"], isRoot: isRoot });
                  setOpenFileModal(true);
                }}
              />
              <StyledIcon
                src={deleteFolderIcon}
                onClick={() => handleDeleteFolder()}
              />
            </StyledIconWrapper>
          )}

          {getLinkInfo(folder["@id"], 1) === "File" && (
            <StyledIconWrapper opacity={_opacity}>
              <StyledIcon
                src={getFileInfoIcon}
                onClick={async () => {
                  const fileInfo = await getFileInfo(
                    getLinkInfo(folder["@id"], 2)
                  );
                  setFileInfo(fileInfo);
                  console.log("ighjhgjhgjhgb");

                  console.log(fileInfo);
                  setOpenFileInfoModal(true);
                }}
              />
              <StyledIcon
                src={deleteFolderIcon}
                onClick={() => handleDeleteFolder()}
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
            setFolderId={setFolderId}
            setFileInfo={setFileInfo}
          />
        )}
      </StyledFolderItem>
    </div>
  );
};

export { FolderList };
