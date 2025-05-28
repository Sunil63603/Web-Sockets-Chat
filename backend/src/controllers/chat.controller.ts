import { Request, Response } from "express";
import { Chat } from "../models/Chat";

//step 1:create or reuse one-to-one chat.
export const createPersonalChat = async (req: any, res: any) => {
  //step 2:extract Ids from request
  const { userIds } = req.body; //[userA,userB]

  //step 3:check if exactly two Ids are present.
  if (!userIds || userIds.length !== 2) {
    return res.status(400).json({ message: "Two user Ids required" });
  }

  try {
    //step 3:check if chat already exists.
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: userIds },
    }).populate("users");

    //step 4:If not,create new chat.
    if (!chat) {
      chat = await Chat.create({
        users: userIds,
        isGroupChat: false,
      });
    }

    chat = await chat.populate("users");

    //step 5:send success response
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error Creating chat", error });
  }
};

//step 1:Get all chats for a user.
export const getUserChats = async (req: Request, res: Response) => {
  //step 2:extract 'id' from request.
  const userId = req.params.userId;

  try {
    //step 3:
    const chats = await Chat.find({ users: userId }) //we are finding all chats where the 'users' array contains userId.(all chats where user is a participant)
      .populate("users") //this replaces user IDs inside 'users' array with actual user data from user collection.
      .populate("latestMessage"); //this replaces the latestMessage ID with the full message object.
    //this makes it easier to show last message in chat preview.

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error Getting chats", error });
  }
};

//step 1:Create a group chat.
export const createGroupChat = async (req: any, res: any) => {
  //step 2:extract 'chatName'(grpName),'users'(participants),'groupAdmin' from request object.
  const { chatName, users, groupAdmin } = req.body;

  //step 3:throw error if anything is missing.
  if (!chatName || !users || users.length < 2 || !groupAdmin) {
    return res.status(400).json({
      message: "chatName,groupAdmin and at least 2 users are required",
    });
  }

  try {
    //step 4:include admin in group.
    const allUsers = [...users, groupAdmin];

    //step 5:create group chat in 'chat' collection
    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users: allUsers,
      groupAdmin: groupAdmin,
      messages: [],
      latestMessage: null,
    });

    //step 6:populate all group members.
    const fullGroupChat = await (
      await groupChat.populate("users")
    ).populate("groupAdmin");

    //step 5:return success response.
    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Error creating group chat", error });
  }
};

//step 1:Write a function to access or create one-to-one chat.
export const accessOrCreateOneToOneChat = async (req: any, res: any) => {
  try {
    //step 2:extract 'myId' and 'frndId' from request params.
    const { myId, frndId } = req.params;

    //step 3:check if chat already exists.
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [myId, frndId] }, //both users must be in 'users'.
    }).populate("users");

    if (!chat) {
      //step 4:If not exists, create new chat.
      chat = await Chat.create({
        isGroupChat: false,
        users: [myId, frndId],
      });

      chat = await chat.populate("users");
    }

    res.status(200).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accessing or creating chat", error });
  }
};
