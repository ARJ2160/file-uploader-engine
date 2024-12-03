import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
dotenv.config();

import routes from "./routes/index";
import { logger } from "./utils/logger";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/api", routes);

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
