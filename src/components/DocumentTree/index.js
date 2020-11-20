import React, { useState, useEffect } from "react";
import { getSubfolders } from "../../features/document";
import { StyledFolderItem, StyledIcon, StyledIconWrapper } from "./styled";
import addFolder from "./assets/add_folder.svg";
import addFile from "./assets/add_file.svg";
import deleteFolder from "./assets/delete_folder.svg";

const FolderList = ({ list, isRoot = false }) => {
  return (
    <div style={{ width: "fit-content" }}>
      {list.map((folder) => (
        //get folder elements
        <FolderItem key={folder["@id"]} folder={folder} isRoot={isRoot} />
      ))}
    </div>
  );
};

const FolderItem = ({ folder, isRoot }) => {
  const [subfolderList, setSubfolderList] = useState([]);
  const [isOpen, setOpen] = useState(false);

  const getSubfolderList = async () => {
    console.log(isRoot);
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    // console.log(`folder id ${folderId}`);
    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }/subfolders?namespace=http://example.cz/Folder`;

    try {
      const subfolderList = await getSubfolders(url);
      setSubfolderList(subfolderList);
      // console.log(subfolderList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSubfolderList();
  }, []);

  const onOpenFolder = (event) => {
    event.stopPropagation();
    setOpen(!isOpen);
  };

  const hasChildren = isOpen && subfolderList.length > 0;
  return (
    <StyledFolderItem onClick={onOpenFolder} isOpen={hasChildren}>
      {folder["http://example.cz/name"]}
      <StyledIconWrapper>
        <StyledIcon src={addFolder} />
        <StyledIcon src={addFile} />
        <StyledIcon src={deleteFolder} />
      </StyledIconWrapper>
      {hasChildren && <FolderList list={subfolderList} />}
    </StyledFolderItem>
  );
};

export { FolderList };
