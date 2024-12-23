import express from "express";
import PostModel from "../models/post-model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostModel.find({}).sort({ createdAt: -1 });
  return res.send(posts);
});

router.post("/", async (req, res) => {
  try {
    const fullToken = req.headers.authorization;
    const actualToken = fullToken.split(" ")[1];
    const response = jwt.verify(actualToken, process.env.JWT_SECRET);
    const { description, mediaUrl } = req.body;
    const newPost = await PostModel.create({ description, mediaUrl });
    return res.send(newPost);
  } catch (error) {
    console.log(error);
    return res.status(401).send("You are not authorized!");
  }
});

export default router;
