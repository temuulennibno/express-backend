import express from "express";
import PostModel from "../models/post-model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { description } = req.body;
  const newPost = await PostModel.create({ description });
  console.log(newPost);
  return res.send(newPost);
});

export default router;
