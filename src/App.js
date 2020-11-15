import React, { useEffect, useState } from "react";
import { getDocumentList, getSubfolders } from "./features/document/index";
import { DocumentTree } from "./components/DocumentTree";
import { Header } from "./components/Header";
import { StyledApp } from "./styled";

function App() {
  const [documentTree, setDocumentTree] = useState([]);
  const [subfolders, setSubfolders] = useState([]);

  const getDocuments = async () => {
    const documentTree = await getDocumentList();
    // console.log(documentTree);
    setDocumentTree(documentTree);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const openSubfolders = async (folderId) => {
    folderId = folderId.replace('http://example.cz/Document/', '');
    const subfoldersList = await getSubfolders(folderId);
    // console.log(subfoldersList);
    setSubfolders(subfoldersList);
  };

  return (
    <StyledApp>
      <Header />
      <DocumentTree list={documentTree} openSubfolders={openSubfolders} subfoldersList={subfolders}/>
    </StyledApp>
  );
}

export default App;
