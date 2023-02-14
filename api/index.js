const express = require("express");
const app = express();
const cors = require("cors")();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");
const PORT = process.env.PORT;

require("dotenv").config();
const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) {
  console.error("TOKEN_SECRET is not set in .env");
  process.exit(1);
}

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header not found" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, tokenSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get('/education', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Education');
    console.log(`Fetched ${rows.length} education records`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error fetching education records: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/education", verifyToken, async (req, res) => {
  const { name, description, created_at, ended_at } = req.body;
  if (!(name && description && created_at)) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await db
      .promise()
      .query(
        "INSERT INTO Education (name, description, created_at, ended_at) VALUES (?,?,?,?)",
        [name, description, created_at, ended_at]
      );
    console.log("Added education record: " + name);
    res.status(200).send("success");
  } catch (error) {
    console.error(`Error adding education record: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/education/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    await db.promise().query("DELETE FROM Education WHERE id = ?", [id]);
    console.log("Deleted education record: " + id);
    res.status(200).send("success");
  } catch (error) {
    console.error(`Error deleting education record: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Projects");
    console.log(`Fetched ${rows.length} project records`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error fetching project records: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/projects", verifyToken, async (req, res) => {
  const { name, description, created_at, ended_at, html_url } = req.body;

  try {
    if (name && description && created_at && html_url) {
      await db.promise().query(
        "INSERT INTO Projects (name, description, created_at, ended_at, html_url) VALUES (?,?,?,?,?)",
        [name, description, created_at, ended_at, html_url]
      );
      console.log(`POST /projects 200: Created project "${name}"`);
      res.sendStatus(200);
    } else {
      console.log(`POST /projects 400: Missing required fields`);
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(`POST /projects 500: ${err}`);
    res.sendStatus(500);
  }
});

app.delete("/projects/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    await db.promise().query("DELETE FROM Projects WHERE id = ?", [id]);
    console.log(`DELETE /projects/${id} 200: Deleted project with ID "${id}"`);
    res.sendStatus(200);
  } catch (err) {
    console.error(`DELETE /projects/${id} 500: ${err}`);
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      console.log(`POST /login 400: Missing username or password`);
      return res.sendStatus(400);
    }

    const results = await db.promise().query("SELECT * FROM Users WHERE username = ?", [username]);

    if (results[0].length === 0) {
      console.log(`POST /login 404: User "${username}" not found`);
      return res.sendStatus(404);
    }

    const user = results[0][0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password.toString());

    if (!isPasswordCorrect) {
      console.log(`POST /login 403: Incorrect password for user "${username}"`);
      return res.sendStatus(403);
    }

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      console.error(`POST /login 500: TOKEN_SECRET is not set`);
      return res.sendStatus(500);
    }

    let token;
    try {
      token = jwt.sign(
        { user: { id: user.id, username: user.username } },
        tokenSecret,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.error(`POST /login 500: Error signing token: ${err}`);
      return res.sendStatus(500);
    }

    console.log(`POST /login 200: User "${username}" logged in`);
    res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.error(`POST /login 500: ${err}`);
    res.sendStatus(500);
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
