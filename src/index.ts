import express from "express";
import { dataBase } from "./db/index";
import { refRouter } from "./routes/refRouter";

const PORT = process.env.PORT || "8080";
const app = express();
app.use(express.json());

dataBase
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use("/ref", refRouter);

app.listen(PORT, () => console.log("Server started on port", PORT));
