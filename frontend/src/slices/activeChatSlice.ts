import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: string[]; //each user in this[], will ref 'User' collection.
  messages: string[];
  latestMessage: string;
  groupAdmin: string;
};

type InitialState = {
  selectedChat: Chat | null;
};

const initialState: InitialState = {
  selectedChat: null,
};

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setActiveChat } = activeChatSlice.actions;
export const selectActiveChat = (state: RootState) => state.activeChat;
export default activeChatSlice.reducer;
