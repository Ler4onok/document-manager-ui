import React from "react";
import { SearchField } from "../SearchField";
import { HeaderWrap, HeaderRightBlock } from "./styled";

export const Header = ({ isAuthorized}) => {
  return (
    <HeaderWrap>
      <div
        style={{ fontWeight: "900", fontSize: "22px", cursor: "pointer" }}
       
      >
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
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Log out
            </div>
          </div>
        )}

        {!isAuthorized && (
          <a
            href="https://kbss.felk.cvut.cz/authorization-service/?tenant=http://example.org/tenants/document-manager&redirectTo=http://localhost:3000/auth"
            style={{
              marginLeft: "25px",
              fontSize: "17px",
              fontWeight: "400",
              textDecoration: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            Log in
          </a>
        )}
      </HeaderRightBlock>
    </HeaderWrap>
  );
};
