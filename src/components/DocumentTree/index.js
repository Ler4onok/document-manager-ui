import React, { useState } from "react";
import { useEffect } from "react";
import { getSubfolders } from "../../features/document";

const DocumentTree = ({ list }) => {
  return (
    <div>
      <h1>Document Tree</h1>
      {list.length > 0 && <FolderList folderList={list} isRoot />}
    </div>
  );
};

const FolderList = ({ folderList, isRoot = false }) => {
  return (
    <div>
      {folderList.map((folder) => (
        <FolderItem key={folder["@id"]} folder={folder} isRoot={isRoot} />
      ))}
    </div>
  );
};

const FolderItem = ({ folder, isRoot }) => {
  const [subFolderList, setSubfolderList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [isRequested, setRequested] = useState(false);

  const getSubfolderList = async () => {
    if (isRequested) return setOpen(!isOpen);
    const folderId = folder["@id"].replace(
      `http://example.cz/${isRoot ? "Document" : "Folder"}/`,
      ""
    );

    const url = `folders/${folderId}${
      isRoot ? "_root" : ""
    }/subfolders?namespace=http://example.cz/Folder`;

    const subfoldersList = await getSubfolders(url);
    setRequested(true);
    setSubfolderList(subfoldersList);
  };

  useEffect(() => {
    getSubfolderList();
  }, []);

  const onOpenFolders = async (e) => {
    e.stopPropagation();
    setOpen(!isOpen);
  };

  const hasChilds = isOpen && subFolderList.length > 0;

  return (
    <div onClick={onOpenFolders}>
      {folder["http://example.cz/name"]}
      {hasChilds && <FolderList folderList={subFolderList} />}
    </div>
  );
};

export { DocumentTree };
