import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../components/Home";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

import Bookings from "../components/Bookings";
import BookingDetails from "../components/BookingDetails";
import BookingEdit from "../components/BookingEdit";
import Profile from "../components/Profile";
import Rooms from "../components/Rooms";

export default (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/me" element={<Profile />} />
    <Route path="/rooms" element={<Rooms />} />
    <Route path="/bookings" element={<Bookings />} />
    <Route path="/bookings/:id" element={<BookingDetails />} />
    <Route path="/bookings/:id/edit" element={<BookingEdit />} />
  </Routes>
);
