import { request } from "../../helpers/index";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LWFkbWluMUBleGFtcGxlLm9yZyIsImlhdCI6MTYxNDAyMDQwOCwiZXhwIjoxNjE0MDI0MDA4fQ.Pyou6mRY0DIkkxHquZy07Idi8EamSDg4ovgAzJYardc";
export const getDocumentList = async () => {
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

export const addFile = async (folder, newFile) => {
  const url = `/folders/${folder}/files?namespace=http://example.cz/Folder`;
  const formData = new FormData();
  formData.append("file", newFile);
  formData.append("uri", "http://example.cz/File/filllle.html");
  formData.append("name", "Name10");

  console.log(formData);

  try {
    const file = await request(url, "POST", formData, {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
    });
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
  parentFolderId,
  isRoot
) => {
  const uriName = name.trim().replace(/\s/g, "");
  const typpe =
    type === "Folder"
      ? `folders/${parentFolderId}${
          isRoot ? "_root" : ""
        }/subfolders?namespace=http://example.cz/Folder`
      : "documents/";
  console.log(typpe);
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
  }
};

export const deleteFolder = async (folderId, isRoot) => {
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
