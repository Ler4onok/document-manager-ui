import { request } from "../../helpers/index";

const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkb2N1bWVudC1tYW5hZ2VyLm9yZyIsImp0aSI6Imh0dHA6Ly9vbnRvLmZlbC5jdnV0LmN6L29udG9sb2dpZXMvdXppdmF0ZWwvZG9jdW1lbnQtbWFuYWdlciIsImlhdCI6MTYxMjA4MDk5OCwiZXhwIjoxNjEyMTY3Mzk4LCJyb2xlIjoiUk9MRV9VU0VSLVJPTEVfQURNSU4ifQ.wZg0V5ummcD1_sGFHL-a-pNhirbz7RImyJeYR391t_R4gMfWTNc_lqpegkD9jwehcdNzJBJwTkcHdXxq7baQlQ";

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

export const addFolder = async (type, name, description) => {
  const uriName = name.trim().replace(/\s/g, "");
  console.log(uriName);
  try {
    const folder = await request(
      `documents/`,
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
    // console.log(subfoldersList);
    return folder;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFolder = async (folderId) => {
  const url = `folders/${folderId}?namespace=http://example.cz/Folder`;
  try {
    await request(url, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    console.log(
      `Something went whong while deletion a folder. Reason: ${error}`
    );
  }
};
