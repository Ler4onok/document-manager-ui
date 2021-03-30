import { animated } from "react-spring";
import styled from "styled-components";

export const StyledIconWrapper = styled.div`
  margin-left: 25px;
  opacity: 0;
  height: 25px;
  transition: opacity 150ms ease-in-out;
  opacity: ${(props) => props.opacity};
`;

export const StyledFolderItem = styled(animated.div)`
  font-size: 22px;
  color: gray;
  cursor: pointer;
  margin: 15px;
  font-weight: ${(props) => (props.isOpen ? "bold" : "normal")};
  color: ${(props) => (props.isOpen ? "#2196f3" : "grey")};
`;

export const StyledIcon = styled.img`
  width: 25px;
  height: 100%;
  margin-right: 10px;
`;
