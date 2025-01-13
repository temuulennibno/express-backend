import express from "express";
import UserModel from "../models/user-model.js";
import FollowModel from "../models/follow-model.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username }).populate("posts").populate("followers").populate("followings");
  return res.send(user);
});

router.post("/follow", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const myId = req.user._id;
  const existingUser = await UserModel.findOne({ _id: userId });
  if (!existingUser) return res.status(404).send({ message: "User not found!" });

  const existingFollow = await FollowModel.findOne({
    user: userId,
    follower: myId,
  });

  if (existingFollow) {
    // Herev follow hiisen baival:
    await FollowModel.findByIdAndDelete(existingFollow._id);
    return res.send({ followed: false, message: "Анфоллов хийлээ" });
  } else {
    // Herev follow hiigeegui baival:
    await FollowModel.create({
      user: userId,
      follower: myId,
    });
    return res.send({ followed: true, message: "Фоллов хийлээ" });
  }
});

export default router;
