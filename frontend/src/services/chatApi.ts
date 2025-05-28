import axios from "axios";
import type { IUser } from "../../../backend/src/models/User";
import type { IMessage } from "../../../backend/src/models/Message";
import mongoose from "mongoose";

//hardcoded for now(Temporary).
export const userId = "682ad1ad304268590514ecd8";
//replace this with actual MongoDB user _id;

//createGroupChat() from controller file, handles request and save group chat in database.

//frontend_component----->createGroupChat() of services------>createGroupChat() of backend.
export const createGroupChat = async (
  grpName: string,
  selectedUsers: string[],
  groupAdmin: string
) => {
  try {
    //step 1:send POST request to backend with all necessary details.
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/chats/group`,
      {
        chatName: grpName,
        users: selectedUsers,
        groupAdmin: groupAdmin,
      }
    );

    //step 2:when user submits group form,return databack to the frontend component.
    return response.data;
  } catch (error) {
    console.error("Error creating group chat:", error);
    throw error;
  }
};

export const accessOrCreateOneToOneChat = async (frndId: string) => {
  //this should return created chat.
  try {
    //step 1:send POST request to backend with all necessary details.
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/chats/access/${userId}/${frndId}`
    );

    //step 2:return created chat back to frontend component.
    return response.data;
  } catch (error) {
    console.error("Error creating 1-1 chat", error);
    throw error;
  }
};

export const fetchAllUsers = async (): Promise<IUser[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/users`
  );
  return response.data;
};

export const getChats = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/chats/${userId}`
  );

  return response.data;
};

export const getMessagesByChatId = async (
  chatId: string
): Promise<IMessage[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/messages/${chatId}`
  );
  return response.data;
};
