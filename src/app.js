import express from "express";
import catagoryRouter from "./routes/catagory.router.js";
import userRouter from "./routes/user.router.js";

const app = express();

app.use(express.json());

app.use("/catagory", catagoryRouter);
app.use("/user", userRouter);

export default app;
