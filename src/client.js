import {BrowserRouter} from "react-router";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");

  ReactDOM.render((
    <BrowserRouter><App/></BrowserRouter>
  ), appEl);
})