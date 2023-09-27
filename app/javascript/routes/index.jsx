import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import Profile from "../components/Profile";

export default (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/me" element={<Profile />} />
  </Routes>
);
