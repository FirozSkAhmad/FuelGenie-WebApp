// PincodeTable.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import PincodeModal from "./PincodeModal";
import { usePermissions } from "../../../utils/permissionssHelper";
const PincodeTable = ({
  pincodes,
  loading,
  error,
  onDelete,
  zoneId,
  onUpdatePincodes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const permissions = usePermissions();
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
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Tooltip
                        title={
                          permissions.update
                            ? "Edit"
                            : "You don't have permission to edit"
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={handleOpenModal}
                            color="primary"
                            disabled={!permissions.update}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip
                        title={
                          permissions.delete
                            ? "Delete"
                            : "You don't have permission to delete"
                        }
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(row)}
                            color="error"
                            disabled={!permissions.delete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Tooltip
          title={
            permissions.create
              ? "Add Pincode"
              : "You don't have permission to add a pincode"
          }
        >
          <span>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              disabled={!permissions.create}
            >
              Add Pincode
            </Button>
          </span>
        </Tooltip>
      </Box>

      <PincodeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        zoneId={zoneId}
        existingPincodes={pincodes}
        onUpdatePincodes={onUpdatePincodes}
      />
    </>
  );
};

export default PincodeTable;
