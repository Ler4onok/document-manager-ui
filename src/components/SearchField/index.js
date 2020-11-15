import React from "react";
import Input from "@material-ui/core/TextField";

export const SearchField = () => {
  return (
    <div>
      <Input
        placeholder="Search"
        inputProps={{ "aria-label": "description" }}
      />
    </div>
  );
};
