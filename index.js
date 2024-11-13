import express from "express";
import { nanoid } from "nanoid";

import * as fs from "fs";

const PORT = 3333;
const app = express();
app.use(express.json());

let todos = [];

app.get("/todos", (req, res) => {
  res.send(todos);
});

app.post("/todos", (req, res) => {
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

// http://localhost:3333/todos/1

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  const todo = todos.find((item) => item.id === Number(id));
  if (!todo) return res.status(404).send({ message: "Todo not found!" });
  return res.send(todo);
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  const index = todos.findIndex((todo) => todo.id === Number(id));
  if (index === -1) return res.status(404).send({ message: "Todo not found!" });
  todos.splice(index, 1);
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
  return res.send({ id });
});

app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Id not found!" });
  // TODO update functions
});

app.listen(PORT, () => {
  const data = fs.readFileSync("./data.json", "utf-8");
  todos = JSON.parse(data);
  console.log(`Server is running on http://localhost:${PORT}`);
});
