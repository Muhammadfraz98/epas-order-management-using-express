import * as dotenv from "dotenv";

dotenv.config();

import express from "express";

const app = express();

import morgan from "morgan";

import fs from "fs";

const port = 3001;

import bodyParser from "body-parser";

import cors from "cors";

import path from "path";

import util from "util";

import { errors } from "celebrate";

import { mongoose } from "mongoose";

import router from "./routes/index.js";

import fileUpload from "express-fileupload";

app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    safeFileNames: true,
  })
);

app.use("", router);

app.use(errors());

app.listen(3001, (err) => {
  if (err) console.log("error", err);
  console.log(`server is running on port 3001`);
});
// httpsServer.listen(443);

mongoose.connect(
  "mongodb+srv://Aness:qwer1234@epasordermanagement.sh0y53g.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function () {
  console.log("Connected successfully");
});
