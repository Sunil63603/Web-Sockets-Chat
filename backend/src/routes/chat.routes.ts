import express from "express";
import {
  createPersonalChat, //create a new 1-to-1 chat.ie,message
  getUserChats, //fetch existing messages
  createGroupChat,
  accessOrCreateOneToOneChat, //create a group chat
} from "../controllers/chat.controller";

const router = express.Router();

//'POST' method on '/api/chats'->create one-to-one chat
router.post("/", createPersonalChat);

//'GET' method on '/api/chats/:userId'->get all chats for a user.
router.get("/:userId", getUserChats);

//'POST' method on '/api/chats/group'->create a group chat.
router.post("/group", createGroupChat);

//'POST' method to create 1-1 chat.
router.post("/access/:myId/:frndId", accessOrCreateOneToOneChat);

export default router;
