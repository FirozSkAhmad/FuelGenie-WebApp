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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../utils/api";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const navigate = useNavigate();

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/team/all-teams");
      if (response.status === 200) {
        setTeams(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams!");
    } finally {
      setLoading(false);
    }
  };

  // Create a new team
  const handleCreateTeam = async () => {
    try {
      const response = await api.post("/admin/team/create-team", {
        teamName: newTeamName,
      });
      if (response.status === 201) {
        toast.success("Team created successfully!");
        setNewTeamName("");
        fetchTeams();
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team.");
    }
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
      <ToastContainer position="top-center" autoClose={3000} />

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
              color: (theme) => theme.palette.text.primary,
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
          disabled={!newTeamName.trim()}
        >
          Create Team
        </Button>
      </Box>

      {/* Display teams as cards */}
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
              backgroundColor: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
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
            <CardActions>
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
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Team;
