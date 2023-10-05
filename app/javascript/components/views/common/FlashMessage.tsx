import React, { useState, useEffect, useContext } from "react";
import { Toast } from "react-bootstrap";
import EventContext from "./EventContext";

const MESSAGE_CLASSES: Record<string, string> = {
  success: "toast-success",
  failure: "toast-failure",
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
      }, 7000);
    });

    return () => {
      eventEmitter.removeAllListeners("showMessage");
    };
  }, [eventEmitter]);

  const messageContent = (
    <div dangerouslySetInnerHTML={{ __html: message }} />
  );

  return (
    <Toast show={show} onClose={() => setShow(false)} className="flash-message-container">
      <Toast.Header className={MESSAGE_CLASSES[messageType as keyof typeof MESSAGE_CLASSES]}>
        <strong className="me-auto">{messageContent}</strong>
      </Toast.Header>
    </Toast>
  );
};

export default FlashMessage;
