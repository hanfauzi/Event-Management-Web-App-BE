import express, { Express, NextFunction, Request, Response } from "express";
import mainRouter from "./routers/index.router";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(mainRouter);

app.use((error: any, _: Request, res: Response, __: NextFunction) => {
  res.status(error?.isExpose ? error?.statusCode : 500).json({
    success: false,
    message: error?.isExpose ? error?.message : "Something Went Wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

