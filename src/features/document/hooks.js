import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteFolder } from ".";
import { addFile, addFolder, addUserPermission, deleteFile, getDocumentList, updateFile, updateFolder } from "./api";
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
    const { isEdit, folderId, isOpen } = modals.folder;
    if (!isEdit || !isOpen) return;

    const id = getLinkInfo(folderId, 2);
    const type = getLinkInfo(folderId, 1);
    const reqType = getEndpointInfo(type);
    const url = `${reqType}/${id}?namespace=http://example.cz/${type}`;

    const editedFolderResponse = await updateFolder({ url, id, values, type });
    // handleAddUserPermission(id);
    // onClose();
    return editedFolderResponse;
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

  const onSuccess =  (response) => {
    const { isRoot, parentFolderId } = modals.folder;
    if (isRoot){
      //if document change the name
      const documents = queryClient.getQueryData(EntityName);
      queryClient.setQueryData(EntityName, documents.map(folder => folder['@id'] === response['@id'] ? response : folder))
    }
    else{
      //if folder change the element in the list of folders 
      const _parentFolderName = getLinkInfo(parentFolderId, 2);
      const parentFolderName = _parentFolderName.includes('_root') ? `FolderChilds:${_parentFolderName.replace('_root', '')}` : `FolderChilds:${_parentFolderName}`;
      const folders = queryClient.getQueryData(parentFolderName);
      queryClient.setQueryData(parentFolderName, folders.map(folder => folder['@id'] === response['@id'] ? response : folder))

    }

    onClose();

  };

  const handleFolder = (values) => {
    if (modals.folder.isEdit) {
      handleUpdateFolder(values);
    } else {
      handleAddFolderFetcher(values);
    }
  };

  const { mutateAsync } = useMutation(handleUpdateFolder, {onSuccess});

  return { editFolder: mutateAsync };
};

export const useDelete = ({onClose, modals}) => {
  const queryClient = useQueryClient();

  const handleDeleteEntity = async (data) => {
    const {folderId, isRoot } = modals.folder;
    const {isFile } = modals.file;
    
    const entityName = getLinkInfo(folderId, 2)

   
    try{
      isFile? await deleteFile(entityName) : await deleteFolder(entityName, isRoot);
    }
    catch(error){
      console.log(error)
    }
    
  }

  const onSuccess = () => {
    const {parentFolderId, folderId, isRoot} = modals.folder;
    const {isFile} = modals.file;


    if (isFile){
        const _parentFolderName = getLinkInfo(parentFolderId, 2);
        const parentFolderName = `FolderChilds:${_parentFolderName}`;
        const folders = queryClient.getQueryData(parentFolderName);
        queryClient.setQueryData(parentFolderName, folders.filter(folder =>  folder['@id'] !== folderId));
    }
    else{
      if (isRoot){
        //if document 
        const documents = queryClient.getQueryData(EntityName);
        queryClient.setQueryData(EntityName, documents.filter(folder => folder['@id'] !== folderId));
      }
      else{
        const _parentFolderName = getLinkInfo(parentFolderId, 2);
        const parentFolderName = _parentFolderName.includes('_root') ? `FolderChilds:${_parentFolderName.replace('_root', '')}` : `FolderChilds:${_parentFolderName}`;
        const folders = queryClient.getQueryData(parentFolderName);
        queryClient.setQueryData(parentFolderName, folders.filter(folder =>folder['@id'] !== folderId));
      }
    }

    onClose();
  }

  const { mutateAsync } = useMutation(handleDeleteEntity, {onSuccess});

  return { handleDeleteEntity: mutateAsync };
}

/**
 * 
 * @param {*} param0 
 */
export const useAddRootFolder = ({ onClose, modals }) => {
  
  const handleAddFolderFetcher = async (data) => {
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

      if (data.userURI !== '' && data.permissionLevel !== ''){
        try{
          await addUserPermission(data.name.trim().replace(/\s/g, ""), data.permissionLevel, data.userURI)
        }
        catch (e) {
          console.log(e);
        }
      }

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
      // console.log(ChildEntityName)
      // console.log(prevChildrens);
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

export const useUpdateFile = ({ onClose, modals}) => {
  const queryClient = useQueryClient();

  const handleUpdateFileFetcher = async (data) => {
    const filename = getLinkInfo(modals.folder.fileInfo['@id'], 2);

    try{
      const updatedFile = updateFile(data.file, filename, modals.folder.updateType)
    }
    catch(error){
      console.log(error)
    }
  }

  const onSuccess = (response) => {
    console.log('ok')
    onClose();
  }

  const { mutateAsync } = useMutation(handleUpdateFileFetcher, {onSuccess});
  return {handleUpdateFileFetcher : mutateAsync}

}


export const useAddFile = ({ onClose, modals }) => {

  const queryClient = useQueryClient();

  const handleAddFileFetcher = async (data) => {
   const {folderId, isRoot} = modals.folder;
   const folderName = getLinkInfo(folderId, 2)

   try{
     if (isRoot){
       console.log(data)
      const addedFile = await addFile('Document', folderName, data.file, data.filename);
      return addedFile;
     }
     else {
      const addedFile = await addFile('Folder', folderName, data.file, data.filename);
      return addedFile;
     }
    

   }
   catch(error){
     console.log(error)
   }
  }

  const onSuccess = (response) => {
    const {folderId} = modals.folder;
    const _parentFolderName = getLinkInfo(folderId, 2);
    const parentFolderName = _parentFolderName.includes('_root') ? `FolderChilds:${_parentFolderName.replace('_root', '')}` : `FolderChilds:${_parentFolderName}`;
    const folders = queryClient.getQueryData(parentFolderName);
    queryClient.setQueryData(parentFolderName, [
      ...folders,
      response,
    ]);

    onClose();
  }

  const { mutateAsync } = useMutation(handleAddFileFetcher, {onSuccess});
  return {handleAddFileFetcher : mutateAsync}
  
}