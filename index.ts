import express from "express";
import categories from "./routes/categories";
import foods from "./routes/foods";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/foods", foods);

const PORT = 5432;

app.listen(PORT, () => console.log("Listening on port " + PORT));
