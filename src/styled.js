import styled from "styled-components";

export const Container = styled.div`
font-family: 'Montserrat', sans-serif;
  color: black;
  height: 100%;
  background: #f4f4f2;
`;

export const StyledDocumentTreeWrapper = styled.div`
  position: relative;
  background: white;
  border-radius: 6px;
  width: 80%;
  padding: 30px;
  margin-left: 10%;
  box-shadow: rgb(189 189 189) 5px 5px 10px -1px;
  overflow: auto;
  height: 450px;
  overflow-x: hidden;
`;

export const StyledIcon = styled.img`
  height: 30px;
  width: 30px;
  position: absolute;
  right: ${props => props.right};
  left: ${props => props.left};
  top: ${props => props.top};
  position:${props => props.position};
  transform:${props => props.transform};
  cursor: pointer;
`;

export const StyledFileInfo = styled.div`
  position: absolute;
  height: 450px;
  overflow: auto;
  overflow-x: hidden;
  z-index: 10;
  right: 15%;
  top: 30%;
  width: 30%;
  border: 1px solid #8080803b;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledFileCharacteristicsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 40px;
`;

export const StyledFileCharacteristic = styled.div`
  /* text-align: center; */
`;

export const StyledVersionsHeaderWrapper = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  justify-content: center;
 `;

export const StyledVersionsHeader = styled.div`
  width: 40%;
  margin:0;
  color: #2196f3;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: center;
`;

