import styled from "styled-components";

export const StyledModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
`;

export const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  width: 30%;
  border-radius: 5px;
  /* padding: 10px 80px; */
`;

export const StyledLine = styled.hr`
  width: 100%;
  background-color: #bbbbbb75;
  border: 0;
  height: 1px;
`;
