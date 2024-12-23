import React, { useState, useEffect } from "react";
import {
  Grid,
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
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Edit, AddCircle, Delete } from "@mui/icons-material";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import { toast } from "react-toastify";
import { useTheme } from "@mui/system";
import { usePermissions } from "../../../utils/permissionssHelper";
const TimeSlots = () => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({});
  const [customSlots, setCustomSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState({});
  const [activeSlotType, setActiveSlotType] = useState({});
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addCustomDialogOpen, setAddCustomDialogOpen] = useState(false);
  const [toShowDialogOpen, setToShowDialogOpen] = useState(false);
  const [slotMaxOrders, setSlotMaxOrders] = useState("");
  const [toShowValue, setToShowValue] = useState("");
  const [error, setError] = useState(null);
  const theme = useTheme();
  const permissions = usePermissions();
  const [newCustomSlot, setNewCustomSlot] = useState({
    fromTime: "",
    toTime: "",
    maxOrders: "",
  });
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [dates, setDates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const fetchSlots = async (weekOrDate) => {
    setLoading(true);
    let url = "";
    // Error state for storing error messages
    setError(null); // Reset previous error

    // Determine if we're fetching by week or by date
    if (weekOrDate === "current" || weekOrDate === "next") {
      // Fetching by week (current or next week)
      url = `/products/time-slots/get-time-slots/${weekOrDate}`;
    } else {
      // Fetching by specific date
      url = `/products/time-slots/by-date/${weekOrDate}`;
    }

    try {
      const response = await api.get(url);

      // Initialize the state variables
      const initialSlots = {};
      const initialCustomSlots = {};
      const initialToShow = {};

      // Check if response.data is an array or an object
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      // Loop through the data (assuming data is now an array)
      data.forEach((dayData) => {
        const { date, defaultSlots, customSlots, toShow } = dayData;

        initialToShow[date] = toShow;
        initialSlots[date] = {};
        initialCustomSlots[date] = {};

        defaultSlots.forEach((slot) => {
          initialSlots[date][slot.slotId] = slot;
        });

        customSlots.forEach((slot) => {
          initialCustomSlots[date][slot.slotId] = slot;
        });
      });

      // Set the state after mapping the data
      setSlots(initialSlots);
      setCustomSlots(initialCustomSlots);
      setActiveSlotType(initialToShow);

      // If we're fetching by week, update dates accordingly
      if (weekOrDate === "current" || weekOrDate === "next") {
        setDates(Object.keys(initialSlots)); // Set initial dates based on the fetched slots
      } else {
        setDates([weekOrDate]); // Only one date selected
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setError("Failed to fetch time slots. Please try again later."); // Set the error message in state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots("current"); // Load the initial slots for the current week
  }, []);

  const handleWeekChange = (event) => {
    const selectedWeek = event.target.value;
    setSelectedWeek(selectedWeek); // Update the week selection
    fetchSlots(selectedWeek); // Fetch the slots for the selected week
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date); // Update the selected date
    fetchSlots(date); // Fetch the slots for the selected date
  };

  // Open update max orders dialog
  const handleOpenUpdateDialog = (date, slotId, type) => {
    setSelectedDate(date);
    setSelectedSlot({ slotId, type });
    const slotData =
      type === "DEFAULT" ? slots[date][slotId] : customSlots[date][slotId];
    setSlotMaxOrders(slotData?.maxOrders || "");
    setUpdateDialogOpen(true);
  };

  // Update max orders API
  const handleUpdateMaxOrders = async () => {
    try {
      const { slotId, type } = selectedSlot;
      await api.patch(`/products/time-slots/update-max-orders/${slotId}`, {
        maxOrders: parseInt(slotMaxOrders, 10),
      });

      if (type === "DEFAULT") {
        setSlots((prev) => ({
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            [slotId]: {
              ...prev[selectedDate][slotId],
              maxOrders: parseInt(slotMaxOrders, 10),
            },
          },
        }));
      } else {
        setCustomSlots((prev) => ({
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            [slotId]: {
              ...prev[selectedDate][slotId],
              maxOrders: parseInt(slotMaxOrders, 10),
            },
          },
        }));
      }

      setUpdateDialogOpen(false);
      setSlotMaxOrders("");
    } catch (error) {
      console.error("Error updating max orders:", error);
    }
  };

  // Open toShow update dialog
  const handleOpenToShowDialog = (date) => {
    setSelectedDate(date);
    setToShowValue(activeSlotType[date]);
    setToShowDialogOpen(true);
  };

  // Update active slot type API
  const handleUpdateToShow = async () => {
    try {
      await api.patch(`/products/time-slots/update-to-show/${selectedDate}`, {
        toShow: toShowValue,
      });

      setActiveSlotType((prev) => ({
        ...prev,
        [selectedDate]: toShowValue,
      }));

      setToShowDialogOpen(false);
    } catch (error) {
      console.error("Error updating active slot type:", error);
    }
  };
  // Add this function to handle opening the Add Custom Slot dialog
  const handleOpenAddCustomDialog = (date) => {
    setSelectedDate(date); // Set the selected date
    setAddCustomDialogOpen(true);
  };

  // Updated function to handle adding a custom slot
  const handleAddCustomSlot = async () => {
    try {
      // Ensure the selectedDate is passed in the body
      const requestBody = {
        date: selectedDate, // Pass the date explicitly
        fromTime: newCustomSlot.fromTime,
        toTime: newCustomSlot.toTime,
        maxOrders: parseInt(newCustomSlot.maxOrders, 10),
      };

      const response = await api.post(
        "/products/time-slots/create-custom-slot",
        requestBody
      );

      const { slotId } = response.data; // Assume API returns the new slot's ID

      setCustomSlots((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [slotId]: { ...requestBody, slotId }, // Include the new slot
        },
      }));

      setAddCustomDialogOpen(false);
      setNewCustomSlot({ fromTime: "", toTime: "", maxOrders: "" }); // Reset form state
      fetchSlots(selectedWeek);
    } catch (error) {
      console.error("Error adding custom slot:", error);
    }
  };

  // Handle delete confirmation dialog open
  const handleDeleteClick = (slotId) => {
    setSlotToDelete(slotId);
    setOpenDialog(true);
  };

  // Handle the delete slot operation
  const handleDeleteSlot = async () => {
    setLoading(true);
    try {
      const response = await api.delete(
        `/products/time-slots/delete-custom-slot/${slotToDelete}`
      );
      if (response.status === 200) {
        toast.success("Slot deleted successfully!");
        // Optionally refresh your list of slots here
        fetchSlots(selectedWeek);
      }
    } catch (error) {
      toast.error("Failed to delete slot.");
    } finally {
      setLoading(false);
      setOpenDialog(false); // Close the dialog after the operation
    }
  };

  // Close the confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Time Slots
      </Typography>
      <BreadcrumbNavigation />

      {/* Week and Date Selection */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Week</InputLabel>
            <Select
              value={selectedWeek}
              onChange={handleWeekChange}
              label="Week"
            >
              <MenuItem value="current">Current Week</MenuItem>
              <MenuItem value="next">Next Week</MenuItem>
              {/* Add more options for weeks as necessary */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{
                shrink: true, // Ensures the label does not overlap the input
              }}
              variant="outlined"
              value={selectedDate}
              onChange={handleDateChange} // Use your existing function
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </InputAdornment>
                ),
                // To remove the default date input icon, override it
                disableUnderline: true, // Disable underline for the input field
              }}
              sx={{
                minWidth: 180,
                "& .MuiInputBase-root": {
                  color: theme.palette.text.primary, // Adjust text color based on the current theme
                },
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        // Show error message if there is an error
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6" color="error" mb={2}>
            {error}
          </Typography>
        </Box>
      ) : Object.keys(slots).length === 0 ||
        Object.keys(customSlots).length === 0 ? (
        // Show "No data available" message if there is no data
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No data available
          </Typography>
        </Box>
      ) : (
        // Only show the table when there is data and no error
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Default Slots</TableCell>
                <TableCell>Custom Slots</TableCell>
                <TableCell>Active Slot</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(slots).map((date) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>

                  {/* Default Slots Column */}
                  <TableCell>
                    {Object.entries(slots[date]).map(([slotId, slot]) => (
                      <Box
                        key={slotId}
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2">{`${slot.fromTime}-${slot.toTime}, Orders: ${slot.maxOrders}`}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenUpdateDialog(date, slotId, "DEFAULT")
                          }
                          disabled={!permissions?.update}
                          title="Update Order Count"
                          sx={{ marginLeft: 1 }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    ))}
                  </TableCell>

                  {/* Custom Slots Column */}
                  <TableCell>
                    {customSlots[date] &&
                    Object.keys(customSlots[date]).length > 0 ? (
                      Object.entries(customSlots[date]).map(
                        ([slotId, slot]) => (
                          <Box
                            key={slotId}
                            display="flex"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography variant="body2">{`${slot.fromTime}-${slot.toTime}, Orders: ${slot.maxOrders}`}</Typography>

                            {/* Update Button */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpenUpdateDialog(date, slotId, "CUSTOM")
                              }
                              disabled={!permissions?.update}
                              title="Update Order Count"
                              sx={{ marginLeft: 1 }}
                            >
                              <Edit />
                            </IconButton>

                            {/* Delete Button */}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(slotId)}
                              title="Delete Slot"
                              sx={{ marginLeft: 1 }}
                              disabled={!permissions?.delete}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        )
                      )
                    ) : (
                      <Typography variant="body2">No Custom Slots</Typography>
                    )}
                  </TableCell>

                  {/* Active Slot Column */}
                  <TableCell>{activeSlotType[date]}</TableCell>

                  {/* Actions Column */}
                  <TableCell>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenToShowDialog(date)}
                          disabled={!permissions?.update}
                        >
                          Update Active Slot
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          startIcon={<AddCircle />}
                          onClick={() => handleOpenAddCustomDialog(date)}
                          color="primary"
                          size="small"
                          variant="text"
                          disabled={!permissions?.create}
                        >
                          Add Custom Slot
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Max Orders Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Max Orders</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Max Orders"
            type="number"
            value={slotMaxOrders}
            onChange={(e) => setSlotMaxOrders(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMaxOrders} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Update Active Slot Dialog */}
      <Dialog
        open={toShowDialogOpen}
        onClose={() => setToShowDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Active Slot Type</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Slot Type"
            value={toShowValue}
            onChange={(e) => setToShowValue(e.target.value)}
          >
            <MenuItem value="DEFAULT">Default</MenuItem>
            <MenuItem value="CUSTOM">Custom</MenuItem>
            <MenuItem value="BOTH">Both</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToShowDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateToShow} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addCustomDialogOpen}
        onClose={() => setAddCustomDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Custom Slot</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="From Time"
            type="time"
            value={newCustomSlot.fromTime}
            onChange={(e) =>
              setNewCustomSlot((prev) => ({
                ...prev,
                fromTime: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="To Time"
            type="time"
            value={newCustomSlot.toTime}
            onChange={(e) =>
              setNewCustomSlot((prev) => ({ ...prev, toTime: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Max Orders"
            type="number"
            value={newCustomSlot.maxOrders}
            onChange={(e) =>
              setNewCustomSlot((prev) => ({
                ...prev,
                maxOrders: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCustomDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCustomSlot} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this slot?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSlot}
            color="secondary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlots;
