import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Button, CircularProgress, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const PincodeTable = ({ pincodes, loading, error, onAddPincode, onEdit, onDelete }) => {
    return (
        <>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : pincodes.length === 0 ? (
                <Typography>No pincodes available</Typography>
            ) : (
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="pincodes table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Pincodes</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pincodes.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                            <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => onDelete(row)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="contained" onClick={onAddPincode}>Add Pincode</Button>
            </Box>
        </>
    );
};

export default PincodeTable;
