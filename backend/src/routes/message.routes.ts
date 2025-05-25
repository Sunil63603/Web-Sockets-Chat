import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller";

const router = express.Router();

//'POST' method on '/api/messages'->send a new message.
router.post("/", sendMessage);

//'GET' method on '/api/messages/:chatId'->get all messages for a chat.
router.get("/:chatId", getMessages);

export default router;
