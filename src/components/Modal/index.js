import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { StyledModal, StyledModalContainer, StyledLine } from "./styled";

export const Modal = ({ handleAddFolder, setOpenModal }) => {
  // console.log(isOpenModal);
  const [newFolder, setNewFolder] = useState({ name: "", description: "" });
  const handleInput = (event, isName) => {
    isName
      ? setNewFolder({ ...newFolder, name: event.target.value })
      : setNewFolder({ ...newFolder, description: event.target.value });
    console.log(newFolder);
  };

  return (
    <StyledModalContainer>
      <StyledModal>
        <div
          className="modalHeader"
          style={{
            display: "flex",
            width: "89%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "15px 0 ", color: "#2196f3" }}>
            Add a new folder
          </h2>
          <div
            style={{ color: "#a9a9a9c9", fontSize: "23px", cursor: "pointer" }}
            onClick={() => setOpenModal(false)}
          >
            ✖
          </div>
        </div>
        <StyledLine />
        <div className="modalContent" style={{ width: "89%" }}>
          <h3 style={{ margin: "0", marginTop: "10px" }}>Folder Name</h3>
          <TextField
            style={{ width: "100%", marginBottom: "10px" }}
            id="standard-basic"
            // label="Folder Name"
            value={newFolder.name}
            onChange={(event) => handleInput(event, true)}
          />
          <h3 style={{ margin: "0" }}>Folder Description</h3>
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            // label="Folder Description"
            value={newFolder.description}
            onChange={(event) => handleInput(event, false)}
          />
        </div>

        <div
          className="modalButtons"
          style={{ margin: "25px 0 15px 0", width: "89%", textAlign: "right" }}
        >
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={() => handleAddFolder(newFolder)}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              padding: " 7px 15px",
              borderRadius: "5px",
            }}
          >
            Submit
          </Button>
        </div>
      </StyledModal>
    </StyledModalContainer>
  );
};
