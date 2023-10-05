import React from "react";

interface ConfirmProps {
  modalID: string;
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
}

const Confirm = ({ modalID, title, message, confirm, cancel, onConfirm }: ConfirmProps) => {
  return (
    <div className="modal" id={modalID} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{cancel}</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm}>{confirm}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;