import mongoose, { Schema, Document } from "mongoose";
//here mongoose is used to import types and import model()function
//'Schema' is a TS type.
//Document is interface which is extended by our custom interface.

//Define a TypeScript interface for a Message document.
//This helps with type safety and IntelliSense during development.
export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId; //sender will store his Id.

  //content will store the actual text of the message.
  content: string;

  //chatId is the ID of chat(group or 1-to-1) this message belongs to
  chatId: mongoose.Types.ObjectId;

  //will store the timestamp(automatically handled by Mongoose).
  createdAt: Date;
}

//Define the schema(structure) for the Message collection.
const messageSchema: Schema<IMessage> = new Schema(
  {
    //sender:refers to the user who sent the message.
    //type:ObjectId,because its a reference to a User Document.
    //ref:'User',tells Mongoose to link this to the User model.
    //required:true means message must have a sender.
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //'ref' is used to establish link between two collections.
      required: true,
    },

    //content:the actual text/message sent.
    //type:String
    //required:true means a message cant be empty.
    content: {
      type: String,
      required: true,
    },

    //chatId:refers to the chat,this message belongs to(group or 1-to-1)
    //type:ObjectId,links to Chat model
    //ref:'Chat',
    //required:true ensures every message belongs to a chat.
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },

  //This second object is schema options.
  {
    //timestamps:true automatically adds createdAt and updateAt fields.
    timestamps: true,
  }
);

//Export the Message Model using mongoose.model()
//'Message'-name of model.
//messageSchema:schema to define the structure.
export const Message = mongoose.model<IMessage>("Message", messageSchema);
