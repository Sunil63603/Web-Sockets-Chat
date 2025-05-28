import React from "react";
import { useState, useEffect } from "react"; //used to store grpName,userIds and groupAdminId.
import { createGroupChat } from "../services/chatApi"; //component will call this function. This function will call backend function.
import { fetchAllUsers } from "../services/chatApi";
import type { IUser } from "../../../backend/src/models/User";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from "@mui/material";
import { userId } from "../services/chatApi";

const CreateGroupChatForm: React.FC = () => {
  const [grpName, setGrpName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  // const [groupAdmin, setGroupAdmin] = useState(""); //Temporary, we'll set manually for now.

  const currentUserId = userId;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    getUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    //this function is called when user clicks on 'handleSubmit()'
    e.preventDefault(); //prevents form reload on submit.

    //extract only user IDs from selected user objects.
    const selectedUserIds = selectedUsers.map((user) => user._id);

    try {
      const newGroup = await createGroupChat(
        grpName,
        selectedUserIds,
        currentUserId
      );
      console.log("Group Created:", newGroup);

      //show success message
      alert("Group Chat created successfully");

      //reset form values
      setGrpName("");
      setSelectedUsers([]);
    } catch (error) {
      alert("Error Creating group");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <Box
        sx={{
          width: 400,
          margin: "auto",
          mt: 4,
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create Group Chat
        </Typography>

        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          sx={{ mb: 2 }}
          value={grpName}
          onChange={(e) => setGrpName(e.target.value)}
        ></TextField>

        <Autocomplete
          multiple
          options={allUsers}
          getOptionLabel={(option) => option.name}
          onChange={(_, newValue) => setSelectedUsers(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add Users"
              variant="outlined"
            ></TextField>
          )}
          sx={{ mb: 2 }}
        ></Autocomplete>

        <Button type="submit" fullWidth variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </form>
  );
};

export default CreateGroupChatForm;
