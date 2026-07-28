import express from "express";
import categories from "./routes/categories";

const app = express();

app.use("/", categories);

const PORT = 5432;

app.listen(PORT, () => console.log("Listening on port " + PORT));
