import React, { useEffect, useState } from "react";
//useEffect is used to fetch chatsList on initial render.
//useState is to store all chats.
// import axios from "axios"; //package used for communication between frontend and backend.
import { useDispatch } from "react-redux"; //used to modify activeChat in store.
import { setActiveChat } from "../slices/activeChatSlice"; //used while dispatching.
import { accessOrCreateOneToOneChat, getChats } from "../services/chatApi";
import { fetchAllUsers } from "../services/chatApi";
import socket from "../socket";

import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { IUser } from "../../../backend/src/models/User";

import { userId } from "../services/chatApi";

type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: string[]; //each user in this[], will ref 'User' collection.
  messages: string[];
  latestMessage: string;
  groupAdmin: string;
};

const ChatList: React.FC = () => {
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const dispatch = useDispatch();

  const activeChat = useSelector(
    (state: RootState) => state.activeChat.selectedChat
  );
  // const chatId = activeChat?._id;

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats();
      setChatsList(chats);
    };

    const fetchUsers = async () => {
      const users = await fetchAllUsers();
      setAllUsers(users);
    };

    fetchChats();
    fetchUsers();
  }, []);

  const handleChatClick = (chat: Chat) => {
    //step 1:leave the previous room
    if (activeChat?._id) {
      socket.emit("leave-chat", activeChat._id);
    }

    //step 2:set new active chat in redux
    dispatch(setActiveChat(chat));

    //step 2:join socket room for that chat.
    socket.emit("join-chat", chat._id);
  };

  const handleUserClick = async (frnd: IUser) => {
    const res = await accessOrCreateOneToOneChat(frnd._id as string);

    handleChatClick(res);
  };

  const getOtherUserName = (users: IUser[], userId: string) => {
    return users.find((user) => user._id !== userId)?.name || "unknown";
  };

  return (
    <div className="p-4 border-r w-2/3">
      <h2 className="font-bold mb-4 text-lg">ChatsList</h2>
      {chatsList.length === 0 ? (
        <div className="text-gray-500 text-center py-6 w-full">
          No chats available
        </div>
      ) : (
        chatsList.map((chat) => (
          <div
            key={chat._id}
            className="cursor-pointer p-4 hover:bg-gray-200 rounded w-full mb-2"
            onClick={() => handleChatClick(chat)}
          >
            {chat.isGroupChat
              ? chat.chatName
              : // @ts-ignore
                getOtherUserName(chat.users, userId)}
          </div>
        ))
      )}
      <h2 className="font-bold text-lg mt-4">Start New Chat</h2>
      {allUsers.map((user) => (
        <div
          // @ts-ignore
          key={user._id}
          className="cursor-pointer p-4 hover:bg-gray-200 rounded w-full mb-2"
          onClick={() => handleUserClick(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
