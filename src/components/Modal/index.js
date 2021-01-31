import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";

export const Modal = ({ handleAddFolder }) => {
  const [newFolder, setNewFolder] = useState({name: "", description: "" });
  const handleInput = (event, isName) => {
    isName
      ? setNewFolder({ ...newFolder, name: event.target.value })
      : setNewFolder({ ...newFolder, description: event.target.value });
    console.log(newFolder);
  };

  return (
    <div>
      <div
        className="modalContainer"
        style={{
          display: "flex",
          background: "white",
          position: "fixed",
          flexDirection: "column",
          width: "100%",
          left: "0",
        }}
      >
        <span>Add a Folder Name</span>
        <TextField
          id="standard-basic"
          label="Name"
          value={newFolder.name}
          onChange={(event) => handleInput(event, true)}
        />
        <span>Add Folder Description</span>
        <TextField
          id="standard-basic"
          label="Description"
          value={newFolder.description}
          onChange={(event) => handleInput(event, false)}
        />
        <Button onClick={() => handleAddFolder(newFolder)}>Submit</Button>
      </div>
    </div>
  );
};
