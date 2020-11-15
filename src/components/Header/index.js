import React from "react";
import { SearchField } from "../SearchField";
import { HeaderWrap, HeaderRightBlock } from "./styled";

export const Header = () => {
  return (
    <HeaderWrap>
      <div>Document Manager</div>
      <HeaderRightBlock>
        <SearchField />
        <div>Log out</div>
      </HeaderRightBlock>
    </HeaderWrap>
  );
};
