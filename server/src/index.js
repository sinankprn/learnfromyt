import express from "express";
import extractRouter from "./routes/extract.js";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow client origin
    credentials: true,
  })
);

app.use("/api", extractRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
