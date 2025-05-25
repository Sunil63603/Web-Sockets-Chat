import { Request, Response } from "express";
import { User } from "../models/User";

//step 1:create a new user.
export const createUser = async (req: any, res: any) => {
  try {
    //step 2:extract name from incoming request.
    const { name } = req.body; //name of friend(new contact).

    //step 3:if theres no name, then throw error
    if (!name) {
      return res.status(400).json({ error: "Name is required" }); //bad request.
    }

    //step 4:create a new user in DB.
    const newUser = await User.create({ name }); //create a newUser.

    //step 5:success response
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

//step 1:Get all users.
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    //step 2:fetch all users
    const users = await User.find();

    //step 3:send 'users' to frontend
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
