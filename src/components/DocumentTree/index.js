import React from "react";

export const DocumentTree = ({ list, openSubfolders, subfoldersList }) => {

  const checkParent = (subfolder, root) => {
    root = root.replace('http://example.cz/Document/', '') + '_root';
    subfolder = subfolder.replace('http://example.cz/Folder/', '')
    return root === subfolder;
  }
  // console.log(subfoldersList);
  return (
    <div>
      <h1>Document Tree</h1>

      {list.length > 0 &&
        list.map((document, index) => (
          <p key={index} onClick={() => openSubfolders(document["@id"])}>
            {document["http://example.cz/name"]}
            {subfoldersList.length > 0 && 
            checkParent(subfoldersList[0]['http://example.cz/parentFolder']["@id"], document["@id"]) &&
              subfoldersList.map((subfolder, index) => (
                 <p style={{color:'red'}}>{subfolder["http://example.cz/name"]}</p>
              ))}
          </p>
        ))}
    </div>
  );
};
