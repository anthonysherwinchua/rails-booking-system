import React, { useState, useEffect, useContext } from "react";
import { Toast } from "react-bootstrap";
import EventContext from "./EventContext";

const MESSAGE_CLASSES = {
  success: "toast-success",
  failure: "toast-danger",
  warning: "toast-warning",
  info: "toast-info",
};

const FlashMessage = () => {
  const [message, setMessage] = useState("Hello");
  const [messageType, setMessageType] = useState("success");
  const [show, setShow] = useState(false);

  const eventEmitter = useContext(EventContext);

  useEffect(() => {
    eventEmitter.on("showMessage", ({ text, type }) => {
      setMessage(text);
      setMessageType(type);
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 3000);
    });

    return () => {
      eventEmitter.removeAllListeners("showMessage");
    };
  }, [eventEmitter]);

  return (
    <Toast show={show} onClose={() => setShow(false)} className="flash-message-container">
      <Toast.Header className={MESSAGE_CLASSES[messageType]}>
        <strong className="me-auto">{message}</strong>
      </Toast.Header>
    </Toast>
  );
};

export default FlashMessage;
