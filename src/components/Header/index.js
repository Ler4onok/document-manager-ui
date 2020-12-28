import React from "react";
import { SearchField } from "../SearchField";
import { HeaderWrap, HeaderRightBlock } from "./styled";

export const Header = () => {
  return (
    <HeaderWrap>
      <div style={{ fontWeight: "900", fontSize: "22px" }}>
        Document Manager
      </div>
      <HeaderRightBlock>
        <SearchField />
        <div
          style={{ marginLeft: "25px", fontSize: "17px", fontWeight: "400" }}
        >
          Log out
        </div>
      </HeaderRightBlock>
    </HeaderWrap>
  );
};
