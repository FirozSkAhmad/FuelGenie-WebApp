import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomSlotDialog = ({ open, onClose, onSave }) => {
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [orderCount, setOrderCount] = useState("");
  const [customSlots, setCustomSlots] = useState([]);

  const handleAddSlot = () => {
    if (fromTime && toTime && orderCount) {
      setCustomSlots((prevSlots) => [
        ...prevSlots,
        { fromTime, toTime, orderCount },
      ]);
      setFromTime("");
      setToTime("");
      setOrderCount("");
    }
  };

  const handleDeleteSlot = (index) => {
    setCustomSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(customSlots); // Pass customSlots to parent component
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Custom Slot</DialogTitle>
      <DialogContent>
        {/* Form for creating a custom slot */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From Time</TableCell>
                <TableCell>To Time</TableCell>
                <TableCell>No. of Orders</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={orderCount}
                    onChange={(e) => setOrderCount(e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSlot}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Display list of custom slots */}
        {customSlots.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From Time</TableCell>
                  <TableCell>To Time</TableCell>
                  <TableCell>No. of Orders</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customSlots.map((slot, index) => (
                  <TableRow key={index}>
                    <TableCell>{slot.fromTime}</TableCell>
                    <TableCell>{slot.toTime}</TableCell>
                    <TableCell>{slot.orderCount}</TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteSlot(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomSlotDialog;
