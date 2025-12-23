'use client'

import "../styles/confirmation-dialog.scss";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog">
      <div 
        className="confirmation-dialog__backdrop"
        onClick={onCancel}
      ></div>
      
      <div className="confirmation-dialog__modal">
        <div className="confirmation-dialog__content">
          <h3 className="confirmation-dialog__title">
            {title}
          </h3>
          <p className="confirmation-dialog__message">
            {message}
          </p>
        </div>
        
        <div className="confirmation-dialog__actions">
          <button
            onClick={onCancel}
            className="confirmation-dialog__button confirmation-dialog__button--cancel"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="confirmation-dialog__button confirmation-dialog__button--confirm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;