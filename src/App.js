import React, { useState } from "react";

import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Login from "./routes/Login/login.js";
import Signal from "./routes/Signal/signal.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}>
        <Route path="login" element={<Login />} />
        <Route path="signal" element={<Signal />} />
      </Route>
    </Routes>
  );
}
