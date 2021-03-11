import { Button } from "@material-ui/core";
import React from "react";
import { StyledModal, StyledModalContainer, StyledLine } from "./styled";

export const Modal = ({
  handleSubmit,
  setOpenModal,
  children,
  newObject,
  header,
}) => {
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
          <h2 style={{ margin: "15px 0 ", color: "#2196f3" }}>{header}</h2>
          <div
            style={{ color: "#a9a9a9c9", fontSize: "23px", cursor: "pointer" }}
            onClick={() => setOpenModal(false)}
          >
            ✖
          </div>
        </div>
        <StyledLine />
        {children}
        <div
          className="modalButtons"
          style={{ margin: "25px 0 15px 0", width: "89%", textAlign: "right" }}
        >
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={() => handleSubmit(newObject)}
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
