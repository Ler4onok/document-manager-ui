import { useEffect, useState } from "react";
import { addFolder, getDocumentList } from "./api";
import { getLinkInfo } from "./utils";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDocumentsContent = async () => {
    try {
      setLoading(true);
      const documentTree = await getDocumentList();
      setLoading(false);
      setDocuments(documentTree);
    } catch (error) {
      setLoading(false);
      setError("Some error");
    }
  };

  useEffect(() => {
    getDocumentsContent();
  }, []);

  return { documents, error, loading };
};

// const useAddFolder = ({ onClose }) => {
//   const handleAddFolder = async (folderData) => {
//     if (folderData.type === "Document") {
//       try {
//         const newF = await addFolder(
//           folderData.type,
//           folderData.name,
//           folderData.description,
//           // selectedFolder.isRoot
//         );
//         onClose();
//         handleAddUserPermission()
//       } catch (e) {
//       }
//     } else {
//       const parentFolderName = getLinkInfo(selectedFolder.id, 2);
//       try {
//         const newF = await addFolder(
//           folderData.type,
//           folderData.name,
//           folderData.description,
//           selectedFolder.isRoot,
//           parentFolderName
//         );
//         // setError(null);
//         onClose();
//       } catch (e) {
//         // setError("Such folder exists. Change the name, please");
//       }
//     }
//   };

//   return { handleAddFolder }
// }