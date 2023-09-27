import React from "react";
import Routes from "../routes";
import { EventEmitter } from "events";
import NavBar from "../components/views/common/NavBar";
import FlashMessage from "../components/views/common/FlashMessage";
import EventContext from "../components/views/common/EventContext";

const eventEmitter = new EventEmitter();

const App = () => (
  <EventContext.Provider value={eventEmitter}>
    <NavBar />
    <FlashMessage />
    {Routes}
  </EventContext.Provider>
);

export default App;