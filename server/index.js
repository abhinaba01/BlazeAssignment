// const express = require("express");
// const app = express();
// const path = require("path");
// const bodyParser = require("body-parser");
// const fs = require("fs");

// app.use(bodyParser.json());
// app.use(express.static("client"));

// let users = [];

// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (user) => user.username === username && user.password === password
//   );

//   if (user) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/index.html"));
// });

// app.get("/:username/todos", (req, res) => {
//   const { username } = req.params;
//   const user = users.find((user) => user.username === username);

//   if (user) {
//     res.json(user.todos);
//   } else {
//     res.json([]);
//   }
// });

// app.post("/:username/todos", (req, res) => {
//   const { username } = req.params;
//   const { text } = req.body;
//   const user = users.find((user) => user.username === username);

//   if (user) {
//     const newTodo = {
//       id: user.todos.length +1,
//       text: text,
//     };
//     user.todos.push(newTodo);

//     res.json(newTodo);
//   } else {
//     res.status(404).json({ error: "User not found" });
//   }
// });

// app.delete("/:username/todos/:id", (req, res) => {
//   const { username, id } = req.params;
//   const user = users.find((user) => user.username === username);

//   if (user) {
//     user.todos = user.todos.filter((todo) => todo.id !== parseInt(id));

//     res.sendStatus(204);
//   } else {
//     res.status(404).json({ error: "User not found" });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.json());
app.use(express.static("client"));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/:username/todos", (req, res) => {
  const { username } = req.params;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
  const user = data.find((user) => user.username === username);
  console.log(user);
  if (user) {
    res.json(user.todos);
  } else {
    res.json([]);
  }
});

app.post("/:username/todos", (req, res) => {
  const { username } = req.params;
  const { text } = req.body;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
  const user = data.find((user) => user.username === username);

  if (user) {
    const newTodo = {
      id: user.todos.length + 1,
      text: text,
    };
    user.todos.push(newTodo);

    fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data));

    res.json(newTodo);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/:username/todos/:id", (req, res) => {
  const { username, id } = req.params;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
  const user = data.find((user) => user.username === username);

  if (user) {
    user.todos = user.todos.filter((todo) => todo.id !== parseInt(id));

    fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data));

    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
