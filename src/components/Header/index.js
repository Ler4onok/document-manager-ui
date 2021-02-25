import React from "react";
import { SearchField } from "../SearchField";
import { HeaderWrap, HeaderRightBlock } from "./styled";

export const Header = ({ isAuthorized }) => {
  return (
    <HeaderWrap>
      <div style={{ fontWeight: "900", fontSize: "22px" }}>
        Document Manager
      </div>
      <HeaderRightBlock>
        {isAuthorized && (
          <div style={{ display: "flex" }}>
            <SearchField />
            <div
              style={{
                marginLeft: "25px",
                fontSize: "17px",
                fontWeight: "400",
                cursor: "pointer",
              }}
              onClick={() => localStorage.removeItem("token")}
            >
              Log out
            </div>
          </div>
        )}

        {!isAuthorized && (
          <a
            href="https://kbss.felk.cvut.cz/authorization-service/?tenant=http://example.org/tenants/document-manager&redirectTo=http://localhost:8080/document-manager"
            style={{
              marginLeft: "25px",
              fontSize: "17px",
              fontWeight: "400",
              // cursor: "pointer",
            }}
          >
            Log in
          </a>
        )}
      </HeaderRightBlock>
    </HeaderWrap>
  );
};
