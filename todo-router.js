import express from "express";
import * as fs from "fs";
import { nanoid } from "nanoid";

const router = express.Router();

let todos = [];
const data = fs.readFileSync("./data.json", "utf-8");
todos = JSON.parse(data);

router.get("/", (req, res) => {
  res.send(todos);
});

router.post("/", (req, res) => {
  const title = req.body.title;
  if (!title) return res.status(400).send({ message: "title is not found" });
  const newTodo = {
    id: nanoid(),
    title: title,
    checked: false,
  };
  todos.push(newTodo);
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
  return res.send(newTodo);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  const todo = todos.find((item) => item.id === Number(id));
  if (!todo) return res.status(404).send({ message: "Todo not found!" });
  return res.send(todo);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  const index = todos.findIndex((todo) => todo.id === Number(id));
  if (index === -1) return res.status(404).send({ message: "Todo not found!" });
  todos.splice(index, 1);
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
  return res.send({ id });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  // TODO update functions
});

export default router;
