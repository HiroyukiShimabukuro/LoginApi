import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import database from "./../infra/database";
import { ApiError } from "./../errors/ApiError";

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
    throw new ApiError("Token missing");
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
      throw new ApiError("Token inválido!");
    }
    next();
  } catch (error) {
    return res.json(error);
  }
}
