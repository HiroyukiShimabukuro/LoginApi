import bycrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import database from "./../../../../infra/database";
import dotenv from "dotenv";
import { User } from "../../dtos/User";
dotenv.config();
interface IRequest {
  name?: string;
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token?: string;
}

class UserUseCase {
  static async authenticate({ email, password }: IRequest): Promise<IResponse> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      email,
    );

    const user = queryResult.rows[0];

    if (!user) {
      throw new Error("Email or password incorrect");
    }
    const passwordMatch = await bycrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Email or password incorrect");
    }
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const token = sign({}, jwtSecret, {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }

  static async create({ name, email, password }: IRequest): Promise<IResponse> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      email,
    );

    const user = queryResult.rows[0];

    if (user) {
      throw new Error("Email already registered");
    }

    await database.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, await bycrypt.hash(password, 10)],
    );

    const jwtSecret = process.env.JWT_SECRET ?? "";
    const token = sign({}, jwtSecret, {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }

  static async list(): Promise<User[]> {
    const queryResult = await database.query(
      "SELECT name, email, created_at FROM users",
    );

    const users = queryResult.rows;
    return users;
  }

  static async update({ name, email, password }: IRequest): Promise<IResponse> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      email,
    );

    const user = queryResult.rows[0];

    if (!user) {
      throw new Error("User not found!");
    }
    await database.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE email = $2",
      [name, email, password],
    );

    const userUpdated: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return userUpdated;
  }

  static async delete(id: number): Promise<void> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE id = $1",
      id,
    );

    const user = queryResult.rows[0];

    if (!user) {
      throw new Error("User not found!");
    }
    await database.query("DELETE * FROM users WHERE id = $1", id);

    return;
  }
}

export { UserUseCase };
