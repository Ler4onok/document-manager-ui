import React from "react";
import { Route, Switch } from "react-router-dom";
import DocumentTree from "./DocumentTree";
import { TokenHandler } from "./components/TokenHandler";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={DocumentTree} />
      <Route path="/auth" exact component={TokenHandler} />;
    </Switch>
  );
};
