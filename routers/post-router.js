import express from "express";
import PostModel from "../models/post-model.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostModel.find({}).populate("user", "_id email username fullname").sort({ createdAt: -1 });
  return res.send(posts);
});

router.post("/", authMiddleware, async (req, res) => {
  const user = req.user;
  const { description, mediaUrl } = req.body;
  const newPost = await PostModel.create({ description, mediaUrl, user: user._id });
  return res.send(newPost);
});

export default router;
