import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomSlotDialog from "../../../components/addProduct/TimeSlots/CustomSlotDialog";
import { useTheme } from "@mui/material/styles";
import { Edit } from "@mui/icons-material";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeSlots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

const TimeSlots = () => {
  const theme = useTheme(); // Access the current theme
  const [slots, setSlots] = useState(
    days.reduce((acc, day) => {
      acc[day] = timeSlots.reduce((slotAcc, slot) => {
        slotAcc[slot] = 5; // Default number of orders per slot
        return slotAcc;
      }, {});
      return acc;
    }, {})
  );

  const [customSlots, setCustomSlots] = useState(
    days.reduce((acc, day) => {
      acc[day] = {}; // Initialize custom slots for each day as an empty object
      return acc;
    }, {})
  );

  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [editedSlots, setEditedSlots] = useState({});
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  const handleOpenDialog = (day) => {
    setSelectedDay(day);
    // Safely merge the default slots with any custom slots
    setEditedSlots({
      ...slots[day], // default slots
      ...customSlots[day], // custom slots
    });
    setOpen(true);
  };

  const handleSlotChange = (slot, value) => {
    setEditedSlots((prevSlots) => ({
      ...prevSlots,
      [slot]: parseInt(value, 10),
    }));
  };

  const handleDeleteSlot = (slot, slotType) => {
    if (slotType === "default") {
      setSlots((prevSlots) => ({
        ...prevSlots,
        [selectedDay]: {
          ...prevSlots[selectedDay],
          [slot]: 0, // Reset the slot count to 0 to represent deletion
        },
      }));
    } else if (slotType === "custom") {
      setCustomSlots((prevCustomSlots) => ({
        ...prevCustomSlots,
        [selectedDay]: {
          ...prevCustomSlots[selectedDay],
          [slot]: null, // Remove custom slot
        },
      }));
    }
  };

  const handleSave = () => {
    // Separate the edited slots into default and custom slots
    const defaultSlots = {};
    const customSlotUpdates = {};

    // Loop through the edited slots and separate default and custom
    Object.entries(editedSlots).forEach(([slot, value]) => {
      // Check if this slot is one of the default time slots
      if (timeSlots.includes(slot)) {
        defaultSlots[slot] = value;
      } else {
        customSlotUpdates[slot] = value;
      }
    });

    // Save the updated default slots
    setSlots((prevSlots) => ({
      ...prevSlots,
      [selectedDay]: { ...prevSlots[selectedDay], ...defaultSlots },
    }));

    // Save the updated custom slots
    setCustomSlots((prevCustomSlots) => ({
      ...prevCustomSlots,
      [selectedDay]: { ...prevCustomSlots[selectedDay], ...customSlotUpdates },
    }));

    setOpen(false);
  };

  const handleCustomSlotSave = (newCustomSlots) => {
    setCustomSlots((prevCustomSlots) => ({
      ...prevCustomSlots,
      [selectedDay]: {
        ...prevCustomSlots[selectedDay],
        ...newCustomSlots,
      },
    }));
    setCustomDialogOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, padding: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Time Slots
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                Day
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                Default Slots
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                Custom Slots
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {day}
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {slots[day] &&
                    Object.entries(slots[day]).map(([slot, count]) => (
                      <div key={slot}>{`${slot}, Orders: ${count}`}</div>
                    ))}
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {customSlots[day] &&
                  Object.entries(customSlots[day]).length > 0 ? (
                    Object.entries(customSlots[day]).map(
                      ([slotKey, slotData]) => (
                        <div key={slotKey}>
                          {`From: ${slotData.fromTime}, To: ${slotData.toTime}, Orders: ${slotData.orderCount}`}
                        </div>
                      )
                    )
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No Custom Slots
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<Edit />}
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(day)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          Edit Slots for {selectedDay}
        </DialogTitle>
        <DialogContent>
          {/* Default Slots Section */}
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary, marginBottom: 1 }}
          >
            Default Slots
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          {Object.keys(slots[selectedDay] || {}).map((slot) => (
            <Box
              key={slot}
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <TextField
                label={`${slot} Order Count (Default)`}
                type="number"
                value={editedSlots[slot] || ""}
                onChange={(e) => handleSlotChange(slot, e.target.value)}
                fullWidth
                margin="dense"
                sx={{ flex: 1 }}
              />
              <IconButton
                color="secondary"
                onClick={() => handleDeleteSlot(slot, "default")}
                sx={{ marginLeft: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          {/* Custom Slots Section */}
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary, marginBottom: 1 }}
          >
            Custom Slots
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          {Object.entries(customSlots[selectedDay] || {}).length > 0 ? (
            Object.entries(customSlots[selectedDay]).map(
              ([slotKey, slotData]) => (
                <Box
                  key={slotKey}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {`From: ${slotData.fromTime}, To: ${slotData.toTime}, Orders: ${slotData.orderCount}`}
                  </Typography>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteSlot(slotKey, "custom")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            )
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginBottom: 2 }}
            >
              No Custom Slots
            </Typography>
          )}

          {/* Add Custom Slot Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setCustomDialogOpen(true)}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Add Custom Slot
          </Button>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Slot Dialog */}
      <CustomSlotDialog
        open={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        onSave={handleCustomSlotSave}
      />
    </Box>
  );
};

export default TimeSlots;
