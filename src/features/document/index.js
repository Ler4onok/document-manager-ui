import { request } from "../../helpers/index";

// GET
export const getDocumentList = async () => {
  const token = localStorage.getItem("token");
  const url = "/documents";
  try {
    const documentList = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(documentList);
    return documentList;
  } catch (error) {
    console.log(error);
  }
};

export const getSubfolders = async (url) => {
  const token = localStorage.getItem("token");
  console.log("get subfolders");
  console.log(url);
  try {
    const subfoldersList = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(subfoldersList);
    return subfoldersList;
  } catch (error) {
    console.log(error);
  }
};

export const getFiles = async (url) => {
  const token = localStorage.getItem("token");

  try {
    const files = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(subfoldersList);
    return files;
  } catch (error) {
    console.log(error);
  }
};

export const getFileInfo = async (fileName) => {
  const token = localStorage.getItem("token");

  const url = `/files/${fileName}?namespace=http://example.cz/File`;
  try {
    const fileInfo = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
      // "Content-Type":
      //   "multipart/form-data; boundary=<calculated when request is sent>",
    });
    // console.log(fileInfo);
    return fileInfo;
  } catch (error) {
    console.log(error);
  }
};

// POST
export const addFile = async (folder, newFile) => {
  const token = localStorage.getItem("token");

  const url = `/folders/${folder}/files?namespace=http://example.cz/Folder`;

  const formData = new FormData();
  formData.append("file", newFile);
  formData.append("uri", "http://example.cz/File/testt.html");
  formData.append("name", "Name17");

  console.log(newFile);
  formData.forEach(console.log);
  console.log(url);

  try {
    const file = await request(
      url,
      "POST",
      formData,
      {
        Authorization: `Bearer ${token}`,
      },
      "multipart/form-data; boundary=<calculated when request is sent>"
    );
    console.log(file);
    return file;
  } catch (error) {
    console.log(error);
  }
};

export const addFolder = async (
  type,
  name,
  description,
  isRoot,
  parentFolderId = null
) => {
  const token = localStorage.getItem("token");

  const uriName = name.trim().replace(/\s/g, "");
  const typpe =
    type === "Document"
      ? "documents/"
      : `folders/${parentFolderId}${
          isRoot ? "_root" : ""
        }/subfolders?namespace=http://example.cz/Folder`;

  console.log(type);
  try {
    const folder = await request(
      `${typpe}`,
      "POST",
      {
        uri: `http://example.cz/${type}/${uriName}`,
        name: `${name}`,
        description: `${description}`,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(request);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
    // console.log('such folder exists')
    // console.log(error);
  }
};

// PUT

export const update = async (url, id, newEntity) => {
  console.log(id);
  console.log(newEntity);
  const token = localStorage.getItem('token');

  try{
    await request(url, 'PUT', {
      "@id": `http://example.cz/${newEntity.type}/${id}`,
      "@type": [
          `http://example.cz/${newEntity.type}`,
          "http://example.cz/Node"
      ],
      "http://example.cz/name": `${newEntity.name}`,
      "http://example.cz/description": `${newEntity.description}`
  },
   {
      Authorization: `Bearer ${token}`,
    }, 'application/ld+json')
  } catch(error){
    throw error;
  }


}




// DELETE
export const deleteFolder = async (folderId, isRoot) => {
  const token = localStorage.getItem("token");

  const url = isRoot
    ? `documents/${folderId}?namespace=http://example.cz/Document`
    : `folders/${folderId}?namespace=http://example.cz/Folder`;
  try {
    return await request(url, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    console.log(
      `Something went whong while deletion a folder. Reason: ${error}`
    );
  }
};
