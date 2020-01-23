import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import { PrimaryButton, SecondaryButton } from "./pattern";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmationDialog({
  children,
  title,
  message,
  okText = "Ok",
  cancelText = "Cancel"
}) {
  const [open, setOpen] = useState(false);
  const [confirmedCallback, setConfirmedCallback] = useState(null);

  const hide = () => {
    setOpen(false);
    setConfirmedCallback(null);
  };

  const confirm = () => {
    confirmedCallback();
    hide();
  };

  const cancel = () => {
    hide();
  };

  const show = rawCallback => {
    return event => {
      event.preventDefault();
      //synthetic events get reused, so we cannot depend on
      // this event being the same after async operation, so clone the pieces we want
      const clonedEvent = {
        ...event,
        target: { ...event.target, value: event.target.value }
      };
      setOpen(true);
      // wrap in additional function as useState will call this function
      setConfirmedCallback(() => () => rawCallback(clonedEvent));
    };
  };

  return (
    <>
      {children(show)}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={cancel}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <PrimaryButton data-testid="confirmation-dialog-ok" onClick={confirm}>
            {okText}
          </PrimaryButton>
          <SecondaryButton
            data-testid="confirmation-dialog-cancel"
            onClick={cancel}
          >
            {cancelText}
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

ConfirmationDialog.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string
};
