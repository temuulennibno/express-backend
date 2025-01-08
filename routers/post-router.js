import express from "express";
import PostModel from "../models/post-model.js";
import CommentModel from "../models/comment-model.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { populate } from "dotenv";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find({})
      .populate("user", "profileUrl username")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "profileUrl username",
        },
      })
      .sort({ createdAt: -1 });
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server can't handle that request" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { description, mediaUrl } = req.body;
    const newPost = await PostModel.create({ description, mediaUrl, user: user._id });
    return res.send(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server can't handle that request" });
  }
});

router.get("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const posts = await PostModel.find({ user: _id });
    return res.send(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server can't handle that request" });
  }
});

router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const user = req.user;
    const newComment = await CommentModel.create({
      comment,
      post: postId,
      user: user._id,
    });
    return res.send(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server can't handle that request" });
  }
});

export default router;
