import React from "react";
import { request } from "../../helpers/index";

const token =
"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkb2N1bWVudC1tYW5hZ2VyLm9yZyIsImp0aSI6Imh0dHA6Ly9vbnRvLmZlbC5jdnV0LmN6L29udG9sb2dpZXMvdXppdmF0ZWwvZG9jdW1lbnQtbWFuYWdlciIsImlhdCI6MTYwNTQ1OTg2OSwiZXhwIjoxNjA1NTQ2MjY5LCJyb2xlIjoiUk9MRV9VU0VSLVJPTEVfQURNSU4ifQ.uSq88iQxa5U_SvuE8JREbIHoJPf_ghG2MmBOJnbuWiV1BbzAwwnoDN0nWXQKpwIasIFk3ov5hleWkKn77IwD_g";

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

export const getSubfolders = async (folderId) => {
  const url = `folders/${folderId}_root/subfolders?namespace=http://example.cz/Folder`;
  try{
    const subfoldersList = await request(url, 'GET', null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(subfoldersList);
    return subfoldersList;
  }
  catch(error){
    console.log(error);
  }

}
