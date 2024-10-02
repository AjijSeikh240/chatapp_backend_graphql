import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import cors from "cors";

// dotenv congig
dotenv.config();

// create express app
const app = express();

// Helmet => for security http method
app.use(helmet());

// Parser json request url (body-parser): this is parser request data to client.
app.use(express.json());

// Parser request body :
app.use(express.urlencoded({ extended: true }));

// file upload:
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Cors : this middleware to protect and restrict access to the server.
app.use(cors());

export default app;
