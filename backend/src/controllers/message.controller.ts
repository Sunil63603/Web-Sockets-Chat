import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";

//step 1:send a new message.
export const sendMessage = async (req: any, res: any) => {
  //step 2:extract details
  const { sender, content, chatId } = req.body;

  //step 3:If details are missing, throw error.
  if (!sender || !content || !chatId) {
    return res.status(400).json({ message: "All fields are missing" });
  }

  try {
    //step 4:create a new message.
    const newMessage = await Message.create({ sender, content, chat: chatId });

    //step 5:update latestMessage field in Chat.
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    //step 6:success response.
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

//step 1:get all messages for a chat.
export const getMessages = async (req: Request, res: Response) => {
  //step 2:get chatId from params.
  const { chatId } = req.params;

  try {
    //step 3:
    const messages = await Message.find({ chat: chatId }) //find all messages where the 'chat' field is equal to 'chatId'(Give me all messages that belong to this chat room)
      .populate("sender", "name") //Replace 'sender' ID with full user object, but only include the 'name' field.
      .populate("chat"); //also replace 'chatId' with full chat object.

    //step 4:success response.
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error getting messages", error });
  }
};
