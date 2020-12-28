import React, { useEffect, useState } from "react";
import { getDocumentList } from "./features/document/index";
import { FolderList } from "./components/DocumentTree";
import { Header } from "./components/Header";
import { StyledApp, StyledDocumentTreeWrapper } from "./styled";

function App() {
  const [documentTree, setDocumentTree] = useState([]);

  const getDocuments = async () => {
    const documentTree = await getDocumentList();
    setDocumentTree(documentTree);
    console.log(documentTree);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  if (documentTree.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <StyledApp>
      <Header />
      <h1 style={{ marginLeft: "10%" }}>Directories</h1>
      <StyledDocumentTreeWrapper>
        <FolderList list={documentTree} isRoot />
      </StyledDocumentTreeWrapper>
    </StyledApp>
  );
}

export default App;
