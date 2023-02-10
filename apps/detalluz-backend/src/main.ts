import express, { Express } from "express";
import dotenv from "dotenv";
import { api } from "./app/api";
import { init } from "./app/common/config";

dotenv.config();
init();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", api);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
