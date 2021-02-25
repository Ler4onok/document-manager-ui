import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import { TokenHandler } from "./components/TokenHandler";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/auth" exact component={TokenHandler} />;
    </Switch>
  );
};
