import express from "express";
import bcrypt from "bcrypt";
import todoRouter from "./todo-router.js";
import cors from "cors";

import * as fs from "fs";

const PORT = 3333;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);

app.post("/signup", (req, res) => {
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

app.post("/signin", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
