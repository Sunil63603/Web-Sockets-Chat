import React, { useEffect, useState } from "react";
//React is used to make component as Functional component.
//useEffect is used to 'join room' whenever chatId changes.
//useState is used to store chatId,message,and messages[].
import type { IMessage } from "../../../backend/src/models/Message";

import { userId } from "../services/chatApi";

import { useSelector } from "react-redux";
import type { RootState } from "../store";

import { getMessagesByChatId } from "../services/chatApi";

import socket from "../socket";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ActiveChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const activeChat = useSelector(
    (state: RootState) => state.activeChat.selectedChat
  );
  const chatId = activeChat?._id;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        const data = await getMessagesByChatId(chatId);

        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    //connect to socket.
    socket.on("connection", () => {
      console.log("Connected to socket server");
    });

    return () => {
      socket.off("connection");
    };
  }, []);

  useEffect(() => {
    //socket.emit send a custom event to the backend.
    socket.emit("join-chat", chatId); //join room.
    //'join-chat' is event name.Backend is listening for this.
    //chatId - tells server "Join me to this room".
    //Like telling WhatsApp:"Add me to group-1"

    //socket.on - listen for an event.
    //'receive-message' will emit this when new message is received.
    socket.on("receive-message", (msg: IMessage) => {
      setMessages((prev) => [...prev, msg]); //this function runs when message arrives.
    }); //show message.

    //socket.on - listen for an event.
    //"typing" is eventName.
    //if current user's(me) id is not equal to socket.id(my friend),that confirms that i am not typing.Someone else is typing.So, show 'Frnd is typing'
    socket.on("typing", (userId: string) => {
      if (userId !== socket.id) setTypingUser("Friend is typing...");
    });

    socket.on("stop-typing", (userId: string) => {
      if (userId !== socket.id) setTypingUser(null);
    });

    return () => {
      //this prevents listening twice for same event.
      socket.off("receive-message"); //clean-up
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [chatId]);

  //step 1:this function executes when user clicks on 'send' button
  const sendMessage = () => {
    //step 2:if theres some string, even after trim.Then this block executes.
    if (message.trim()) {
      //step 3:create object by combining both chatId and message.
      const messageData = {
        chatId,
        content: message,
        userId: userId,
      };

      //step 4:Already joined chat room, now just send-message to the server.
      socket.emit("send-message", messageData); //send message.

      //step 5:after sending message,input box should be cleared.
      setMessage("");
    }
  };

  return activeChat ? (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Chat Room:{chatId}
      </Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: "auto" }}
      >
        <Stack spacing={1}>
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No messages
            </Typography>
          ) : (
            messages.map((msg, i) => (
              <Typography key={i} variant="body2">
                {msg.content}
              </Typography>
            ))
          )}
        </Stack>
      </Paper>
      {typingUser && (
        <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
          {typingUser}
        </Typography>
      )}
      <TextField
        fullWidth
        placeholder="Enter message"
        variant="outlined"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", chatId);
          }

          setTimeout(() => {
            setIsTyping(false);
            socket.emit("stop-typing", chatId);
          }, 2000);
        }}
        sx={{ mb: 2 }}
      ></TextField>
      <Button variant="contained" onClick={sendMessage}>
        Send
      </Button>
    </Box>
  ) : (
    <div className="flex-1 p-4">
      <p>Select a chat to start messaging</p>
    </div>
  );
};

export default ActiveChat;
