import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import database from "./../infra/database";

interface IPayload {
  sub: string;
}
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader?.split(" ") || [];
  if (!token) {
    return res.status(401).send();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const { sub: userOfToken } = verify(token, jwtSecret);

    const queryResult = await database.query(
      "SELECT * FROM users WHERE id = $1",
      [userOfToken],
    );

    const user = queryResult.rows[0];
    if (!user) {
      return res.status(401).send();
    }
    next();
  } catch (error) {
    return res.status(401).send();
  }
}
