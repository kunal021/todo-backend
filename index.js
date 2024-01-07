const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();

app.use(cors());
app.use(express.json());

const DB = process.env.DATABASE;

mongoose.connect(DB).then((res) => console.log("Connected to DB"));

app.get("/", (req, res) => {
  Todo.find()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json(err));
});

app.post("/", (req, res) => {
  const task = req.body.task;
  Todo.create({ task: task })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json(err));
});

app.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(404).json(err));
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({
        message: "NO TODO FOUND",
      });
    }
    //toggole the done field
    todo.done = !todo.done;

    await todo.save();

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(500).json({ message: "Error toggling todo", error: err });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
