import { request } from "../../helpers/index";

const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkb2N1bWVudC1tYW5hZ2VyLm9yZyIsImp0aSI6Imh0dHA6Ly9vbnRvLmZlbC5jdnV0LmN6L29udG9sb2dpZXMvdXppdmF0ZWwvZG9jdW1lbnQtbWFuYWdlciIsImlhdCI6MTYwOTE3NDQzOSwiZXhwIjoxNjA5MjYwODM5LCJyb2xlIjoiUk9MRV9VU0VSLVJPTEVfQURNSU4ifQ.dbUifiKxjVJtf89fGiY6gvpX1wCuUToVzs0u6YYS3MfZ0qwn32jHqcMLTS448eS4KHwhTgo6Hu0Jo4fmoMuhOg";

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
