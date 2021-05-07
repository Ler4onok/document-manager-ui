import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClientProvider, QueryClient } from 'react-query'
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
