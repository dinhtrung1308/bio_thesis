import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/antd.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./routes/Login/login";
import Signal from "./routes/Signal/signal";
import History from "./routes/History/history";
import Relatives from "./routes/Relatives/relatives";
import SignUp from "./routes/SignUp/signup";
import Detail from "./routes/Detail/detail";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/detail" element={<Detail />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signal" element={<Signal />} />
      <Route path="/history" element={<History />} />
      <Route path="/relatives" element={<Relatives />} />
    </Routes>
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
