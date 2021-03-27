import { useMutation, useQuery, useQueryClient } from "react-query";
import { addFolder, getDocumentList, updateFolder } from "./api";
import { getLinkInfo, getEndpointInfo } from "./utils";

const EntityName = "RootDocuments";

/**
 *
 */
export const useDocuments = () => {
  const { data, isLoading, error } = useQuery(EntityName, getDocumentList);
  return { documents: data, error, loading: isLoading };
};

/**
 *
 * @param {*} param0
 */
export const useEditFolder = ({ modals, onClose }) => {
  const queryClient = useQueryClient();

  const handleUpdateFolder = async (values) => {
    const { isEdit, parentFolderId, isOpen } = modals.folder;
    if (!isEdit || !isOpen) return;

    const id = getLinkInfo(parentFolderId, 2);
    const type = getLinkInfo(parentFolderId, 1);
    const reqType = getEndpointInfo(type);
    const url = `${reqType}/${id}?namespace=http://example.cz/${type}`;

    await updateFolder({ url, id, values, type });
    // handleAddUserPermission(id);
    onClose();
  };

  const handleAddFolderFetcher = async (data) => {
    const { isRoot, parentFolderId, isOpen, isEdit } = modals.folder;
    if (!isOpen || isEdit) return;

    const parentFolderName = getLinkInfo(parentFolderId, 2);

    try {
      await addFolder(
        parentFolderId ? "Folder" : "Document",
        data.name,
        data.description,
        isRoot,
        parentFolderName
      );
      onClose();
      // handleAddUserPermission();
    } catch (e) {
      console.log(e);
    }
  };

  const onSuccess = async (response, rootDocument) => {
    const prevRootDocuments = queryClient.getQueryData(EntityName);
    if (prevRootDocuments) {
      queryClient.setQueryData(EntityName, [
        ...prevRootDocuments,
        { ...rootDocument, id: response.id },
      ]);
    }
  };

  const handleFolder = (values) => {
    if (modals.folder.isEdit) {
      handleUpdateFolder(values);
    } else {
      handleAddFolderFetcher(values);
    }
  };

  const { mutateAsync } = useMutation();

  return { handleFolder };
};

/**
 * 
 * @param {*} param0 
 */
export const useAddRootFolder = ({ onClose, modals }) => {
  
  const handleAddFolderFetcher = async (data) => {
    console.log(data)
    const { isRoot, parentFolderId, isOpen, isEdit } = modals.folder;
    if (!isOpen || isEdit) return;

    const parentFolderName = getLinkInfo(parentFolderId, 2);

    try {
      const addedFolderResponse = await addFolder(
        parentFolderId ? "Folder" : "Document",
        data.name,
        data.description,
        isRoot,
        parentFolderName
      );

      return addedFolderResponse;
      // handleAddUserPermission();
    } catch (e) {
      console.log(e);
    }
  };

  const onSuccess = (response, rootDocument) => {
    const { parentFolderId } = modals.folder;

    if (!parentFolderId) {
      const prevRootDocuments = queryClient.getQueryData(EntityName);
      
      if (prevRootDocuments) {
        queryClient.setQueryData(EntityName, [
          ...prevRootDocuments,
          response,
        ]);
      }
    } else {
      const ChildEntityName = `FolderChilds:${getLinkInfo(parentFolderId, 2)}`;
      const prevChildrens = queryClient.getQueryData(ChildEntityName);
      console.log(prevChildrens);
      if (prevChildrens) {
        queryClient.setQueryData(ChildEntityName, [
          ...prevChildrens,
          response,
        ]);
      }
    }

    onClose();
  };

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(handleAddFolderFetcher, {
    onSuccess,
  });

  return { addRootFolder: mutateAsync, isLoading, error };
};
