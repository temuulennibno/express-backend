import express from "express";
import PostModel from "../models/post-model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostModel.find({}).sort({ createdAt: -1 });
  return res.send(posts);
});

router.post("/", async (req, res) => {
  const { description } = req.body;
  const newPost = await PostModel.create({ description });
  console.log(newPost);
  return res.send(newPost);
});

export default router;
