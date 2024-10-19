import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { Home, CheckCircle, ShoppingCart } from "@mui/icons-material";

const metrics = [
  {
    id: 1,
    title: "Pending Orders",
    value: 11,
    icon: <ShoppingCart />,
    bgColor: "#FFCC00",
  },
  {
    id: 2,
    title: "Delivered Orders",
    value: 50,
    icon: <CheckCircle />,
    bgColor: "#00C853",
  },
  {
    id: 3,
    title: "Total Sales",
    value: "₹245,489",
    icon: <Home />,
    bgColor: "#2979FF",
  },
];

const MetricCards = () => {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={4} key={metric.id}>
          <Card sx={{ backgroundColor: metric.bgColor, color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {metric.icon}
                <Box ml={2}>
                  <Typography variant="h6">{metric.title}</Typography>
                  <Typography variant="h4">{metric.value}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricCards;
