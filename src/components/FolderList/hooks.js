import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getFiles, getSubfolders, getFolderByURI } from "../../features/document";
import { getDocumentPermissions } from "../../features/document/api";
import { getLinkInfo } from "../../features/document/utils";

const EntityName = 'FolderChilds';

export const useFolderChildren = ({ folder, isRoot }) => {

  const getSubfolderList = async () => {
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
      return _filesList;
    } catch (error) {
      console.error(error);
    }
  };

  const getFolderItems = async () => {
    try {
      const subfolders = await getSubfolderList();
      const files = await getFilesList(isRoot);
      return subfolders.concat(files);
    } catch (error) {
      console.log(error);
    }
  };


  const { data: folderChilds = [] } = useQuery(`${EntityName}:${getLinkInfo(folder["@id"], 2)}`, getFolderItems);

  return { folderChilds };
};

export const useFolderPermission = ({ isRoot, document }) => {
  const [level, setLevel] = useState(null);
  
  const getUserPermissions = async () => {
    const documentId = getLinkInfo(document['@id'], 2);
    const users = await getDocumentPermissions(documentId);
    const currentUser = localStorage.getItem('currentUserUri');
    // http://example.org/users/Administrator+One
    const permissionLevel = users.find(user => user['http://example.cz/userUri'] === currentUser)['http://example.cz/level'];
    setLevel(permissionLevel);
  };
  
  useEffect(() => {
    if (isRoot) {
      getUserPermissions();
    }
  }, [document, isRoot]);

  return { level };
};