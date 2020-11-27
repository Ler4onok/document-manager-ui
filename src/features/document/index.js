import { request } from "../../helpers/index";

const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkb2N1bWVudC1tYW5hZ2VyLm9yZyIsImp0aSI6Imh0dHA6Ly9vbnRvLmZlbC5jdnV0LmN6L29udG9sb2dpZXMvdXppdmF0ZWwvZG9jdW1lbnQtbWFuYWdlciIsImlhdCI6MTYwNjQxOTkzNiwiZXhwIjoxNjA2NTA2MzM2LCJyb2xlIjoiUk9MRV9VU0VSLVJPTEVfQURNSU4ifQ.wAFUiRdKtDVvAr_4Varrb25RVIJqDzB1HSFIyPazUh5LqKauYlq-hTJxC-IaRcfdnH4Wu4WBmv391C5pkULBIw";

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
