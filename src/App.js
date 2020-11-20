import React, { useEffect, useState } from "react";
import { getDocumentList } from "./features/document/index";
import { DocumentTree } from "./components/DocumentTree";
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
      <DocumentTree list={documentTree} />
    </StyledApp>
  );
}

export default App;
