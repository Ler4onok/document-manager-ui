import React, { useEffect, useState } from "react";
import { getDocumentList } from "./features/document/index";
import { FolderList } from "./components/DocumentTree";
import { Header } from "./components/Header";
import { StyledApp } from "./styled";

function App() {
  const [documentTree, setDocumentTree] = useState([]);

  const getDocuments = async () => {
    const documentTree = await getDocumentList();
    setDocumentTree(documentTree);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <StyledApp>
      <Header />
      <h1>Document Tree</h1>
      <FolderList list={documentTree} isRoot />
    </StyledApp>
  );
}

export default App;
