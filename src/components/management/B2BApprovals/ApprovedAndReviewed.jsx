import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Comment as CommentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const ApprovedAndReviewed = ({ customer }) => {
  const { isAccepted, reviewedBy, previouslyReviewedBy, lastUpdatedBy } =
    customer;

  // Helper function to render fields if they are not null or empty
  const renderField = (label, value, icon) => {
    if (value !== null && value !== undefined && value !== "") {
      // Format date if the label is "Updated At"
      const formattedValue =
        label === "Updated At"
          ? new Date(value).toLocaleString() // Format date to a readable string
          : Array.isArray(value)
          ? value.join(", ") // Join array values with a comma
          : value;

      return (
        <ListItem sx={{ padding: "4px 0" }}>
          <ListItemIcon sx={{ minWidth: "36px" }}>{icon}</ListItemIcon>
          <ListItemText
            primary={label}
            secondary={formattedValue}
            secondaryTypographyProps={{
              variant: "body2",
              color: "text.secondary",
            }}
          />
        </ListItem>
      );
    }
    return null;
  };

  // Determine the icon and title based on the isAccepted prop
  let statusIcon;
  let statusTitle;

  if (isAccepted === null) {
    statusIcon = <InfoIcon sx={{ mr: 1, color: "yellow", fontSize: "20px" }} />;
    statusTitle = "Pending Approval";
  } else if (isAccepted === false) {
    statusIcon = <CancelIcon sx={{ mr: 1, color: "red", fontSize: "20px" }} />;
    statusTitle = "Not Approved";
  } else {
    statusIcon = (
      <CheckCircleIcon sx={{ mr: 1, color: "green", fontSize: "20px" }} />
    );
    statusTitle = "Approved and Reviewed";
  }

  return (
    <Card
      sx={{
        borderRadius: "8px",
        marginBottom: "24px",
      }}
    >
      <CardContent sx={{ padding: "24px" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
        >
          {statusIcon}
          {statusTitle}
        </Typography>

        <Grid container spacing={3}>
          {/* Reviewed By Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: "16px" }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: "18px" }} />
              Reviewed By
            </Typography>
            {reviewedBy?.uid ? ( // Check if uid is not null
              <List>
                {renderField(
                  "UID",
                  reviewedBy?.uid,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Name",
                  reviewedBy?.name,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Management Remarks",
                  reviewedBy?.managementRemarks,
                  <CommentIcon />
                )}
                {renderField(
                  "Teams",
                  reviewedBy?.teams?.length > 0 ? reviewedBy.teams : null,
                  <GroupIcon />
                )}
              </List>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <InfoIcon
                  sx={{ color: "text.secondary", fontSize: "32px", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No reviewed data available.
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Previously Reviewed By Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: "16px" }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: "18px" }} />
              Previously Reviewed By
            </Typography>
            {previouslyReviewedBy?.uid ? ( // Check if uid is not null
              <List>
                {renderField(
                  "UID",
                  previouslyReviewedBy?.uid,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Name",
                  previouslyReviewedBy?.name,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Management Remarks",
                  previouslyReviewedBy?.managementRemarks,
                  <CommentIcon />
                )}
                {renderField(
                  "Teams",
                  previouslyReviewedBy?.teams?.length > 0
                    ? previouslyReviewedBy.teams
                    : null,
                  <GroupIcon />
                )}
              </List>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <InfoIcon
                  sx={{ color: "text.secondary", fontSize: "32px", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No previously reviewed data available.
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Last Updated By Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: "16px" }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: "18px" }} />
              Last Updated By
            </Typography>
            {lastUpdatedBy?.uid ? ( // Check if uid is not null
              <List>
                {renderField(
                  "UID",
                  lastUpdatedBy?.uid,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Name",
                  lastUpdatedBy?.name,
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
                {renderField(
                  "Remarks",
                  lastUpdatedBy?.remarks,
                  <CommentIcon />
                )}
                {renderField(
                  "Updated At",
                  lastUpdatedBy?.updatedAt,
                  <ScheduleIcon />
                )}
                {renderField(
                  "Teams",
                  lastUpdatedBy?.teams?.length > 0 ? lastUpdatedBy.teams : null,
                  <GroupIcon />
                )}
              </List>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <InfoIcon
                  sx={{ color: "text.secondary", fontSize: "32px", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No last updated data available.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ApprovedAndReviewed;
