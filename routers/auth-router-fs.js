import express from "express";
import bcrypt from "bcrypt";
import * as fs from "fs";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync("./user.json", "utf-8"));
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) return res.status(400).send({ message: "Email already registered!" });

  bcrypt.hash(password, 10, function (err, hash) {
    const newUser = { email, password: hash };
    fs.writeFileSync("./user.json", JSON.stringify([...users, newUser]));
    return res.status(201).send(newUser);
  });
});

router.post("/signin", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log({ email, password });
  const users = JSON.parse(fs.readFileSync("./user.json", "utf-8"));
  const existingUser = users.find((user) => user.email === email);
  console.log({ existingUser });
  if (!existingUser) return res.status(400).send({ message: "Email or password not correct!" });
  bcrypt.compare(password, existingUser.password, function (err, result) {
    if (!result) {
      return res.status(400).send({ message: "Email or password not correct!" });
    } else {
      return res.status(200).send({ message: "Welcome" });
    }
  });
});

export default router;
