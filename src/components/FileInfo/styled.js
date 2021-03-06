import styled from 'styled-components';

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
  display: flex;
  align-items: center;
`;

export const StyledFileCharacteristicTitle = styled.div`
  margin-right: 5px;
  font-weight: 700;
`;


export const StyledVersionsHeaderWrapper = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  justify-content: center;
`;

export const StyledVersionsHeader = styled.div`
  width: 40%;
  margin: 0;
  color: #2196f3;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: center;
`;

export const StyledIcon = styled.img`
  height: 30px;
  width: 30px;
  position: absolute;
  right: ${(props) => props.right};
  top: ${(props) => props.top};
  position: ${(props) => props.position};
  transform: ${(props) => props.transform};
  cursor: pointer;
`;
