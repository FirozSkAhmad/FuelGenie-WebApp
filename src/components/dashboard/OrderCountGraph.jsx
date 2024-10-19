import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const data = [
  { time: "01:00 AM", count: 30 },
  { time: "02:00 AM", count: 45 },
  { time: "03:00 AM", count: 60 },
  { time: "04:00 AM", count: 75 },
  { time: "05:00 AM", count: 50 },
  { time: "06:00 AM", count: 80 },
  { time: "07:00 AM", count: 70 },
];

const OrderCountGraph = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Count Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default OrderCountGraph;
