import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UsersTable } from "../../components/UsersTable";
import axios from "axios";
import { AddUserModal, NewUserData } from "../../components/AddUserModal";
import Cookie from "js-cookie";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  companyPosition: string;
  createdAt: string;
}

export const Admin = () => {
  const apiPath = import.meta.env.DEV
    ? "/api/development/mandown_authentication"
    : `${import.meta.env.VITE_API_URL}/development/mandown_authentication`;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const fetchUsers = async () => {
    setLoading(true); // Ensure loading is true when fetching
    setError(null); // Reset error
    try {
      const token = Cookie.get("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${apiPath}`,
        {
          action: "get-users",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        setError("No users data received");
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsConfirmDeleteDialogOpen(true);
  };

  const closeConfirmDeleteDialog = () => {
    setUserToDelete(null);
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const token = Cookie.get("token");
    if (!token) {
      setError("Authentication token not found.");
      closeConfirmDeleteDialog();
      return;
    }

    try {
      // Ensure your backend API is configured to handle this action
      // and delete the user from DynamoDB based on the username.
      const response = await axios.post(
        `${apiPath}`,
        {
          action: "delete-user", // This action should trigger deletion in your backend
          username: userToDelete.username, // Or any other unique identifier your backend uses
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Adjust success condition based on your API's response
        console.log("User deletion initiated successfully:", response.data);
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(
          response.data?.message ||
            "Failed to delete user: No specific error message from API."
        );
      }
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while deleting the user."
      );
    } finally {
      closeConfirmDeleteDialog();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleAddUser = async (userData: NewUserData) => {
    // TODO: Implement API call to add user
    console.log("Adding user:", userData);
    const token = Cookie.get("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const newUserData = {
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      position: userData.position || " ",
      company: userData.company || " ",
    };

    try {
      const response = await axios.post(
        `${apiPath}`,
        {
          action: "register",
          ...newUserData,
          password: "P@ssw0rd",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Adjust success condition based on your API
        console.log("User added successfully:", response.data);
        handleCloseAddUserModal();
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(
          response.data.message ||
            "Failed to add user: No specific error message from API."
        );
      }
    } catch (err: any) {
      console.error("Failed to add user:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred while adding the user.";
      throw new Error(errorMessage); // Re-throw to be caught by modal's error handling
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddUserModal}
          >
            Add User
          </Button>
        </Box>
        <Paper sx={{ p: 3, mt: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            // Use the actual API data when available, or sample data for demonstration
            <UsersTable
              users={users.length > 0 ? users : []}
              onDeleteUser={openConfirmDeleteDialog}
            />
          )}
        </Paper>
      </Box>
      <AddUserModal
        open={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onAddUser={handleAddUser}
      />
      {userToDelete && (
        <Dialog
          open={isConfirmDeleteDialogOpen}
          onClose={closeConfirmDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the user "{userToDelete.firstName}{" "}
              {userToDelete.lastName}" ({userToDelete.username})? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteUser} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};
