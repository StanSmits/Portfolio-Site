const app = require("express")();
require("dotenv").config();
const cors = require("cors")();

const db = require("./database");
const PORT = process.env.PORT;

app.use(cors);

app.get("/education", async (req, res) => {
    const results = await db.promise().query(`SELECT * FROM Education`)
    console.log(results[0])
    res.status(200).send(results[0])
});

app.post("/education", async (req, res) => {
  const { name, description, created_at } = req.body;
  if (name && description && created_at) {
    try {
      await db.promise().query(
        `INSERT INTO Education VALUES('${name}','${description}','${created_at}')`
      );
      console.log('Added %d to the db', name)
    } catch (err) {
      console.error(err);
    }
  }
});

app.get("/projects", async (req, res) => {
    const results = await db.promise().query(`SELECT * FROM Projects`)
    console.log(results[0])
    res.status(200).send(results[0])
});

app.post("/projects", async (req, res) => {
  // Check the authorisation
  const { name, description, created_at, html_url } = req.body;
  if (name && description && created_at && html_url) {
    try {
      await db.promise().query(
        `INSERT INTO Projects VALUES('${name}','${description}','${created_at}', '${html_url}')`
      );
      console.log('Added %d to the db', name)
    } catch (err) {
      console.error(err);
    }
  }
});

app.get("/aboutme", async (req, res) => {
  const results = await db.promise().query(`SELECT * FROM AboutMe`)
  console.log(results[0])
  res.status(200).send(results[0])
})

app.listen(PORT, () => console.log("Listening on port " + PORT));
