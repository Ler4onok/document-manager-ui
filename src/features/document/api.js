import { request } from "../../helpers/index";

export const getDocumentList = async () => {
  const token = localStorage.getItem("token");
  const url = "/documents";
  try {
    const documentList = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    return documentList;
  } catch (error) {
    return error;
  }
};

export const getSubfolders = async (url) => {
  const token = localStorage.getItem("token");
 
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

export const getFileVersions = async (fileName) => {
  const token = localStorage.getItem("token");
  const url = `/files/${fileName}/versions?namespace=http://example.cz/File`;
  try {
    const fileVersions = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    return fileVersions;
  } catch (error) {
    throw error;
  }
};

export const getFileContent = async (fileName, version) => {
  const token = localStorage.getItem("token");
  const url = version
    ? `/files/${fileName}/content/${version}?namespace=http://example.cz/File`
    : `/files/${fileName}/content?namespace=http://example.cz/File`;
  try {
    const fileContent = await request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });

    return fileContent;
  } catch (error) {
    return error;
  }
};

export const getDocumentPermissions =  (documentId) => {
  const token = localStorage.getItem("token");
  const url = `documents/${documentId}/permissions/user?namespace=http://example.cz/Document`;
  try {
    const userPermissions =  request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });

    return userPermissions;
  } catch (error) {
    return error;
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const url = 'https://kbss.felk.cvut.cz/authorization-service/api/v1/users/current'
  try {
    const currentUser =  request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });

    return currentUser;
  } catch (error) {
    return error;
  }

}

export const getUsers = () => {
  const token = localStorage.getItem('token');
  const url = 'https://kbss.felk.cvut.cz/authorization-service/api/v1/tenants/current/users'
  try {
    const currentUser =  request(url, "GET", null, {
      Authorization: `Bearer ${token}`,
    });

    return currentUser;
  } catch (error) {
    return error;
  }
}


// POST
export const addFile = async (entityType, folder, newFile, fileName) => {
  const token = localStorage.getItem("token");

  const url = `${entityType.toLowerCase()}s/${folder}/files?namespace=http://example.cz/${entityType}`;

  const formData = new FormData();

  formData.append("file", newFile);
  formData.append("uri", `http://example.cz/File/${fileName.trim().replace(/\s/g, "")}.html`);
  formData.append("name", fileName);

  // formData.forEach(console.log);
  // console.log(url);

  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}: ${value}`);
  // }

  try {
    const file = await request(
      url,
      "POST",
      formData,
      {
        Authorization: `Bearer ${token}`,
      },
      true
    );
    console.log(file)
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
        "Content-Type": "application/json",
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

export const addUserPermission = (documentId, permissionLevel, userURI) => {
  const token = localStorage.getItem("token");

  const url = `documents/${documentId}/permissions/user?namespace=http://example.cz/Document`;

  try {
    const newPermission = request(
      url,
      "POST",
      {
        permissionLevel: `${permissionLevel}`,
        userURI: `http://example.org/users/${userURI}`,
      },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    return newPermission;
  } catch (error) {
    throw error;
  }
};

// PUT

export const updateFolder = async ({ url, id, values, type }) => {
  console.log(id);
  const token = localStorage.getItem('token');

  try{
    const updatedFolder = await request(url, 'PUT', {
      "@id": `http://example.cz/${type}/${id}`,
      "@type": [
          `http://example.cz/${type}`,
          "http://example.cz/Node"
      ],
      "http://example.cz/name": `${values.name}`,
      "http://example.cz/description": `${values.description}`
  },
   {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ld+json'
    })

    return updatedFolder;
  } catch(error){
    throw error;
  }
}

export const updateFile = (newData, fileName, updateType) => {
  const token = localStorage.getItem("token");

  if (updateType === 'content'){
    const url = `files/${fileName}/${updateType}?namespace=http://example.cz/File`;
    const formData = new FormData();
    formData.append("file", newData);

    try {
      return request(
        url,
        "PUT",
        formData,
        {
          Authorization: `Bearer ${token}`,
        },
        true
      );
    } catch (error) {
      throw error;
    }
    
  }
  else{
    const url = `files/${fileName}?namespace=http://example.cz/File`;
    console.log(newData)
    console.log(fileName)
    try {
      return request(
        url,
        "PUT",
        {
          "@id": `http://example.cz/File/${fileName}`,
          "@type": [
              "http://example.cz/File",
              "http://example.cz/Node"
          ],
          "http://example.cz/name": `${newData}`
      },
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/ld+json'

        },
        false
      );
    } catch (error) {
      throw error;
    }
  }
  
  

  
};

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
    throw error;
  }
};

export const deleteFile = async (fileName) => {
  const token = localStorage.getItem("token");
  const url = `files/${fileName}?namespace=http://example.cz/File`;

  try {
    return await request(url, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUserPermission = async (permissionId) => {
  const token = localStorage.getItem("token");
  const url = `permissions/user/${permissionId}?namespace=http://example.cz/UserPermission`;

  try {
    return await request(url, "DELETE", null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    throw error;
  }
};


