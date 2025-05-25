import mongoose, { Schema, Document } from "mongoose";
//mongoose is used to create models/schema here.
//'Schema' is used to 'type'(TS)
//Document is like a class imported from mongoose.

//IUser is interface which can be re-used.
export interface IUser extends Document {
  name: string;
}

//here 'Schema' is both type and constructor method.
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true }, //name shall be same.Id needs to be different.So,unique is false
});

//'User' is collection name and 'UserSchema' is schema name
export const User = mongoose.model<IUser>("User", UserSchema);
