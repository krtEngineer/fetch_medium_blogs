import e from "express";
import { convertRssToJson } from "./app.js";
const app = e();

const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/", (req, res) => {
  res.send("This is an api to get list of Medium stories.");
});

app.get("/medium-posts", async (req, res) => {
  let userName = req.query["user_name"];
  if (userName) {
    let response = await convertRssToJson(userName);
    if (response) {
      res.status(200).send(response);
    } else {
      res.status(400).send({ message: "Error in fetching medium stories." });
    }
  } else {
    res.status(400).send({
      message: "Error in fetching medium stories. Incorrect username.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
