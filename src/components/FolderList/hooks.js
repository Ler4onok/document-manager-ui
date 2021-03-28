import { useQuery } from "react-query";
import { getFiles, getSubfolders, getFolderByURI } from "../../features/document";
import { getLinkInfo } from "../../features/document/utils";

const EntityName = 'FolderChilds';

export const useFolderChildren = ({ folder, isRoot }) => {

  const getFolderData = async () => {
    const folderId = getLinkInfo(folder["@id"], 2);
    const _folderData = await getFolderByURI(folderId);
    console.log(_folderData);
    return _folderData;
  }


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
  // const { data: folderData = [] } = useQuery(`FolderData:${getLinkInfo(folder["@id"], 2)}`, getFolderData);

  return { folderChilds,
    //  folderData 
    };
};
