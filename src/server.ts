import express, { NextFunction, Request, Response, Router } from "express";
import { router } from "./routes";
const app = express();
const route = Router();

app.use(express.json());

app.use(router);

app.listen(3333, () => "server running on port 3333");
