import React, { useState, useEffect, useRef } from "react";
import { useTransition, animated, useSpring, config } from "react-spring";
import styled from "styled-components";

import { getSubfolders } from "../../features/document";
import { StyledFolderItem, StyledIcon, StyledIconWrapper } from "./styled";
import addFolderIcon from "./assets/add_folder.svg";
import addFileIcon from "./assets/add_file.svg";
import deleteFolderIcon from "./assets/delete_folder.svg";

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
  const [isOpen, setOpen] = useState(false);
  const [_opacity, setOpacity] = useState(0);

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
    config: config.gentle,
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
      // console.log(subfolderList);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFolder = async () => {
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    const url = `folders/${folderId}?namespace=http://example.cz/Folder`;

    handleDeleteFolder(folderId);

    // try{
    //     await request(url, 'DELETE', null, {
    //       Authorization: `Bearer ${token}`,
    //     })
    // }
    // catch(error){
    //   console.error(error);
    // }
  };

  const handleDeleteFolder = (folderId) => {
    console.log({ folderId });
    // const updatedSubfolderList = subfolderList.filter(subfolder => subfolder !== folderId);
    // console.log(updatedSubfolderList);
    // setSubfolderList(updatedSubfolderList);
  };

  useEffect(() => {
    getSubfolderList();
  }, []);

  const onOpenFolder = (event) => {
    event.stopPropagation();
    setOpen(!isOpen);
  };

  const onMouseEnter = (e) => {
    e.stopPropagation();
    setOpacity(1);
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setOpacity(0);
  };

  const hasChildren = isOpen && subfolderList.length > 0;
  return (
    <StyledFolderItem
      style={{ height, opacity, transform }}
      onClick={onOpenFolder}
      isOpen={hasChildren}
    >
      <div
        style={{ display: "flex" }}
        onMouseEnter={onMouseEnter}
        onMouseOut={onMouseOut}
      >
        {folder["http://example.cz/name"]}
        <StyledIconWrapper opacity={_opacity}>
          <StyledIcon src={addFolderIcon} />
          <StyledIcon src={addFileIcon} />
          <StyledIcon src={deleteFolderIcon} onClick={deleteFolder} />
        </StyledIconWrapper>
      </div>
      {hasChildren && <FolderList list={subfolderList} />}
    </StyledFolderItem>
  );
};

export { FolderList };
