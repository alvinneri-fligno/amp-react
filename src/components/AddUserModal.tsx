import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { isValidEmail } from "../pages/Login/login";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userData: NewUserData) => Promise<void>;
  userToUpdate: any;
}

export interface NewUserData {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  position: string;
  company: string;
}

const modalStyle = {
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onAddUser,
  userToUpdate,
}) => {
  const [formData, setFormData] = useState<NewUserData>({
    username: userToUpdate ? userToUpdate.username : "",
    firstName: userToUpdate ? userToUpdate.firstName : "",
    lastName: userToUpdate ? userToUpdate.lastName : "",
    role: userToUpdate ? userToUpdate.role : "",
    position: userToUpdate ? userToUpdate.companyPosition : "",
    company: userToUpdate ? userToUpdate.company : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when modal is opened or closed
    if (!open || !userToUpdate) {
      setFormData({
        username: "",
        firstName: "",
        lastName: "",
        role: "",
        position: "",
        company: "",
      });
      setError(null);
      setIsSubmitting(false);
    }

    if (userToUpdate) {
      setFormData({
        username: userToUpdate ? userToUpdate.username : "",
        firstName: userToUpdate ? userToUpdate.firstName : "",
        lastName: userToUpdate ? userToUpdate.lastName : "",
        role: userToUpdate ? userToUpdate.role : "",
        position: userToUpdate ? userToUpdate.companyPosition : "",
        company: userToUpdate ? userToUpdate.company : "",
      });
    }
  }, [open, userToUpdate]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (
      (!formData.username ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.role ||
        !formData.position ||
        !formData.company) &&
      formData.role !== "admin"
    ) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(formData.username)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onAddUser(formData);
      // onClose(); // Optionally close modal on success, or let parent handle it
    } catch (submissionError: any) {
      setError(submissionError.message || "Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-user-modal-title"
    >
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography id="add-user-modal-title" variant="h6" component="h2">
          {userToUpdate ? "Edit User" : "Add New User"}
        </Typography>

        <TextField
          size="small"
          sx={{ marginBottom: ".5em" }}
          name="username"
          label="Email"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          disabled={!!userToUpdate}
        />

        <TextField
          size="small"
          sx={{ marginBottom: ".5em" }}
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          size="small"
          sx={{ marginBottom: ".5em" }}
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
        />

        <FormControl
          fullWidth
          size="small"
          sx={{ marginBottom: ".5em" }}
          required
        >
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ marginBottom: ".5em" }}>
          <InputLabel id="position-label">Position</InputLabel>
          <Select
            labelId="position-label"
            name="position"
            value={formData.position}
            label="Position"
            onChange={handleChange}
          >
            <MenuItem value="supervisor">Supervisor</MenuItem>
            <MenuItem value="worker">Worker</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ marginBottom: ".5em" }}>
          <InputLabel id="company-label">Company</InputLabel>
          <Select
            labelId="company-label"
            name="company"
            value={formData.company}
            label="Company"
            onChange={handleChange}
          >
            <MenuItem value="company a">Company A</MenuItem>
            <MenuItem value="company b">Company B</MenuItem>
            <MenuItem value="company c">Company C</MenuItem>
          </Select>
        </FormControl>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : userToUpdate ? (
              "Update User"
            ) : (
              "Add User"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
