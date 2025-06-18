import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  companyPosition: string;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  onDeleteUser: (user: User) => void;
}

const capitalizeWords = (str: string) => {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onDeleteUser,
}) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Users
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.username}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {`${user.firstName} ${user.lastName}`}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{capitalizeWords(user.role)}</TableCell>
                <TableCell>{capitalizeWords(user.company) || "-"}</TableCell>
                <TableCell>
                  {capitalizeWords(user.companyPosition) || "-"}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete User">
                    <IconButton
                      onClick={() => onDeleteUser(user)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {/* Add Edit button here if needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
