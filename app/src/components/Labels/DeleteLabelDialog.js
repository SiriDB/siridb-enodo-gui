import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { socket } from "../../store";

export default function DeleteLabelDialog({
  open,
  handleClose,
  selectedLabel,
}) {
  const onDelete = () => {
    const data = { selector: selectedLabel.name };
    socket.emit("/api/enodo/labels/delete", data, () => {
      handleClose();
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Delete label?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            "Are you sure you want to delete this label? This results in the removal of all related series from Enodo."
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {"Cancel"}
        </Button>
        <Button onClick={onDelete} color="error">
          {"Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
