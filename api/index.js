const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors")();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");
const PORT = process.env.PORT;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded());

const verifyToken = (req, res, next) => {
  let token = req.header("Authorization");
  const secret = process.env.TOKEN_SECRET;

  if (!token || token === "undefined") {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

app.get("/education", async (req, res) => {
  const results = await db.promise().query(`SELECT * FROM Education`);
  console.log("Returned education [" + results[0].length + "]");
  res.status(200).send(results[0]);
});

app.post("/education", verifyToken, async (req, res) => {
  const { name, description, created_at, ended_at } = req.body;
  if (name && description && created_at) {
    try {
      await db
        .promise()
        .query(
          "INSERT INTO Education (name, description, created_at, ended_at) VALUES (?,?,?,?)",
          [name, description, created_at, ended_at]
        );

      console.log("Added education: " + name);
      res.status(200).send("success");
    } catch (err) {
      res.status(500).send("error");
    }
  }
});

app.delete("/education/:id", verifyToken, async (req, res) => {
  id = req.params.id;
  try {
    await db.promise().query("DELETE FROM Education WHERE id = ?", [id]);
    console.log("Deleted education: " + id);
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("error");
  }
});

app.get("/projects", async (req, res) => {
  const results = await db.promise().query(`SELECT * FROM Projects`);
  console.log("Returned projects [" + results[0].length + "]");
  res.status(200).send(results[0]);
});

app.post("/projects", verifyToken, async (req, res) => {
  const { name, description, created_at, ended_at, html_url } = req.body;
  if (name && description && created_at && html_url) {
    try {
      await db
        .promise()
        .query(
          "INSERT INTO Projects (name, description, created_at, ended_at, html_url) VALUES (?,?,?,?,?)",
          [name, description, created_at, ended_at, html_url]
        );
      console.log("Added project: " + name);
      res.status(200).send("success");
    } catch (err) {
      res.status(500).send("error");
      console.error(err);
    }
  }
});

app.delete("/projects/:id", verifyToken, async (req, res) => {
  id = req.params.id;
  try {
    await db.promise().query("DELETE FROM Projects WHERE id = ?", [id]);
    console.log("Deleted project: " + id);
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }

  try {
    const results = await db
      .promise()
      .query("SELECT * FROM Users WHERE username = ?", [username]);

    if (results[0].length === 0) {
      return res.status(404).send("User not found");
    }

    const user = results[0][0];

    try {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password.toString()
      );

      if (!isPasswordCorrect) {
        return res.status(403).send("Incorrect password");
      }
      const tokenSecret = process.env.TOKEN_SECRET;
      if (!tokenSecret) {
        return res.status(500).send("TOKEN_SECRET is not set");
      }
      let token;
      try {
        token = jwt.sign(
          { user: { id: user.id, username: user.username } },
          tokenSecret,
          { expiresIn: "1h" }
        );
      } catch (err) {
        console.error(err);
        return res.status(500).send("Error signing token");
      }
      console.log("User logged in: " + user.username);
      res.status(200).send({ token: token, username: user.username });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error comparing password");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error querying database");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const results = await db
        .promise()
        .query("SELECT * FROM Users WHERE username = ?", [username]);

      // Only maximum 1 user can be in the database at any time, so if the length is 1 then someones trying to hack us
      const amountOfUsers = await db
        .promise()
        .query("SELECT COUNT(*) FROM Users");
      console.log(amountOfUsers[0][0]["COUNT(*)"]);

      if (amountOfUsers[0][0]["COUNT(*)"] >= 1) {
        return res
          .status(500)
          .send(
            "Too many users in database, please stop hacky wacky me (╯°□°）╯︵ ┻━┻"
          );
      }

      if (results[0].length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db
          .promise()
          .query(
            `INSERT INTO Users (id, username, password) VALUES('${uuidv4()}', '${username}', '${hashedPassword}')`
          );
        console.log("User registered: " + username);
        res.status(200).send("success");
      } else {
        res.status(403).send("User already exists");
      }
    } catch (err) {
      res.status(500).send("error");
      console.log(err);
    }
  }
});

app.listen(PORT, () => console.log("Listening on port " + PORT));
