import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  chatName: string; //Holds chatting-group names
  isGroupChat: boolean;
  users: mongoose.Types.ObjectId[]; //participants
  messages: mongoose.Types.ObjectId[]; //existing conversations
  latestMessage?: mongoose.Types.ObjectId; //useful for showing preview(ie.in whatsapp, i can see last message of all contacts without going into them)
  groupAdmin?: mongoose.Types.ObjectId;
}

type ChatType = "personal" | "group";

const chatSchema: Schema<IChat> = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //'ref' is used to connect two schemas
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //optional for group-chats
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
