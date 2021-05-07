import styled from "styled-components";

export const StyledIcon = styled.img`
  height: ${(props) => `${props.size}px`};
  width: ${(props) => `${props.size}px`};
  position: absolute;
  right: ${(props) => props.right};
  left:  ${(props) => props.left};
  top: ${(props) => props.top};
  position: ${(props) => props.position};
  transform: ${(props) => props.transform};
  cursor: pointer;
`;
