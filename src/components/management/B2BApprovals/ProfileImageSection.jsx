import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const ProfileImageSection = ({ profileImage }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Box style={{ marginLeft: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        <AccountCircle
          fontSize="small"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        <strong>Profile Image</strong>
      </Typography>
      <Box
        style={{
          marginLeft: "28px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {profileImage ? (
          <>
            <img
              src={
                profileImage.endsWith(".jpg") ||
                profileImage.endsWith(".jpeg") ||
                profileImage.endsWith(".png")
                  ? profileImage
                  : `${profileImage}.jpg`
              }
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                display: imageError ? "none" : "block",
              }}
              onError={() => setImageError(true)}
            />
            {imageError && (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <AccountCircle style={{ fontSize: "50px", color: "#ccc" }} />
              </div>
            )}
          </>
        ) : (
          <Typography variant="body1" style={{ fontStyle: "italic" }}>
            No profile image available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProfileImageSection;
