import React from "react";
import { StyledModal, StyledModalContainer, StyledLine } from "./styled";
import Button from "@material-ui/core/Button";

export const Modal = ({
  handleSubmit,
  onClose,
  children,
  header,
  isDelete
}) => {
  const color = isDelete? 'secondary' : 'primary'
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
            onClick={onClose}
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
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          
          <Button
            variant="contained"
            color={color}
            onClick={handleSubmit}
            style={{
              marginLeft: "10px",
              padding: " 7px 15px",
              background: "#2196f3",
            }}
          >
            {isDelete? 'Delete': 'Submit'}
          </Button>
        </div>
      </StyledModal>
    </StyledModalContainer>
  );
};
