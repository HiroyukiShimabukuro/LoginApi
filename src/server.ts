import express, { NextFunction, Request, Response, Router } from "express";

const app = express();
const route = Router();

app.use(express.json());

app.listen(3333, () => "server running on port 3333");

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(request);

    if (err instanceof Error) {
      return response.status(400).json({
        error: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err}`,
    });
  },
);

app.use(route);
