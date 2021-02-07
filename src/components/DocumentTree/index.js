import React, { useState, useEffect, useRef } from "react";
import { useTransition, animated, useSpring, config } from "react-spring";
import styled from "styled-components";

import {
  getSubfolders,
  deleteFolder,
  addFolder,
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
import { Modal } from "../Modal";

const FolderItemWrapper = styled(animated.div)``;

const FolderList = ({ list, isRoot = false }) => {
  return (
    <div style={{ width: "fit-content" }}>
      {list.map((folder) => (
        <FolderItem key={folder["@id"]} folder={folder} isRoot={isRoot} />
      ))}
    </div>
  );
};

const FolderItem = ({ folder, isRoot }) => {
  const [subfolderList, setSubfolderList] = useState([]);
  const [parentFolderList, setParentFolderList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);
  const [isOpenModal, setOpenModal] = useState(false);

  const [isSubmitted, setSubmitted] = useState(false);

  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height:
        isRoot && isOpen
          ? "auto"
          : isOpen
          ? (subfolderList.length + 1) * 25 + subfolderList.length * 15
          : 25,
      opacity: 1,
      transform: `translate3d(0px,0,0)`,
    },
    config: config.stiff,
  });

  const getSubfolderList = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    // console.log(`folder id ${folderId}`);
    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }/subfolders?namespace=http://example.cz/Folder`;

    try {
      const _subfolderList = await getSubfolders(url);
      setSubfolderList(_subfolderList);
      // console.log(_subfolderList);
      // console.log(subfolderList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFolder = async (newFolder) => {
    const newF = await addFolder(
      "Document",
      newFolder.name,
      newFolder.description
    );
    console.log(newF);

    // const newFolder = await addFolder("Document", name);
    // console.log(newFolder);
  };

  const handleDeleteFolder = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );
    // console.log(folderId);
    console.log(deleteFolder(folderId));

    // handleDeleteFolder(folderId);
  };

  //UPDATE THE SUBFOLDER LIST AFTER DELETE
  // const handleDeleteFolder = (folderId) => {
  //   console.log({ folderId });
  //   // console.log(subfolderList);
  //   const updatedSubfolderList = subfolderList.filter(
  //     (subfolder) => subfolder !== folderId
  //   );
  //   console.log(updatedSubfolderList);
  //   setSubfolderList(updatedSubfolderList);
  // };

  useEffect(() => {
    getSubfolderList();
  }, []);

  const onOpenFolder = (event) => {
    event.stopPropagation();
    if (subfolderList.length > 0) setOpen(!isOpen);
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setOpacity(1);
  };

  const onMouseLeave = (e) => {
    e.stopPropagation();
    setOpacity(0);
  };

  const hasChildren = isOpen && subfolderList.length > 0;
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
          <StyledIconWrapper opacity={_opacity}>
            <StyledIcon
              src={addFolderIcon}
              onClick={() => setOpenModal(true)}
            />
            <StyledIcon src={addFileIcon} />
            <StyledIcon
              src={deleteFolderIcon}
              onClick={() => handleDeleteFolder()}
            />
          </StyledIconWrapper>
        </div>
        {hasChildren && <FolderList list={subfolderList} />}
      </StyledFolderItem>
      {isOpenModal && (
        <Modal handleAddFolder={handleAddFolder} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export { FolderList };
