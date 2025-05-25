import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";

//Server is created in 'index.ts',Router is created in .route.ts files
const router = express.Router();

//'POST' method on '/api/users'-->create a new user.
router.post("/", createUser);

//'GET' method on '/api/users'-->get all users.
router.get("/", getAllUsers);

export default router;
