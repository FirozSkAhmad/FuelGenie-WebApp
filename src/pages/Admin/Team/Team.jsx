import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../utils/api";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [actionLoading, setActionLoading] = useState(false); // For button loading
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all teams
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/teams/all-teams");
      setTeams(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new team
  const handleCreateTeam = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/admin/teams/create-team", {
        teamName: newTeamName.trim(),
      });
      if (response.status === 201) {
        toast.success("Team created successfully!");
        setNewTeamName("");
        fetchTeams();
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a team
  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    setActionLoading(true);
    try {
      const response = await api.delete(
        `/admin/teams/delete-a-team/${teamToDelete.teamId}`
      );
      if (response.status === 200) {
        toast.success("Team deleted successfully!");
        fetchTeams();
        setOpenDeleteDialog(false); // Close the dialog after deletion
      } else {
        toast.error("Failed to delete the team.");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("An error occurred while deleting the team.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
    setTeamToDelete(null);
  };

  const handleOpenDeleteDialog = (team) => {
    setTeamToDelete(team);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Teams Management
      </Typography>

      {/* Create Team Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          mb: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          p: 2,
          borderRadius: "8px",
        }}
      >
        <TextField
          label="Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: (theme) => theme.palette.background.default,
            },
            "& .MuiInputLabel-root": {
              color: (theme) => theme.palette.text.secondary,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTeam}
          disabled={!newTeamName.trim() || actionLoading}
        >
          {actionLoading ? <CircularProgress size={20} /> : "Create Team"}
        </Button>
      </Box>

      {/* Display Teams */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {teams.map((team) => (
          <Card
            key={team.teamId}
            sx={{
              width: "400px",
              height: "200px",
              p: 2,
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {team.teamName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: (theme) => theme.palette.text.secondary }}
              >
                Team ID: {team.teamId}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  navigate(`/admin/team/${team.teamId}`, {
                    state: { teamName: team.teamName },
                  })
                }
                sx={{ mt: 2 }}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenDeleteDialog(team)}
                sx={{ mt: 2, ml: 2 }}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <DeleteIcon />
                )}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the team "{teamToDelete?.teamName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTeam} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
