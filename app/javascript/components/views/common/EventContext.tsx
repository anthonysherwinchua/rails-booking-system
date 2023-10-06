import { createContext } from "react";
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

const EventContext = createContext(eventEmitter);

export default EventContext;