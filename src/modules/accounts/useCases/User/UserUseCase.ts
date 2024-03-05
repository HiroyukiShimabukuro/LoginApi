import bycrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import database from "./../../../../infra/database";
import dotenv from "dotenv";
import { User } from "../../dtos/User";
import { ApiError } from "../../../../errors/ApiError";
import { Query, QueryResult } from "pg";
dotenv.config();
interface IRequest {
  name: string;
  email: string;
  password: string;
  id?: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token?: string;
}
type UserWithoutPassword = Omit<User, "password">;
type IRequestWithoutName = Omit<IRequest, "name">;
interface IPaginatedUsers {
  users: UserWithoutPassword[];
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
  };
}

class UserUseCase {
  static async authenticate({
    email,
    password,
  }: IRequestWithoutName): Promise<IResponse> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const user = queryResult.rows[0];

    if (!user) {
      throw new ApiError("Email or password incorrect");
    }

    const passwordMatch = await bycrypt.compare(
      password.toString(),
      user.password,
    );
    if (!passwordMatch) {
      throw new ApiError("Email or password incorrect");
    }

    const jwtSecret = process.env.JWT_SECRET ?? "";

    const token = await sign(
      {
        sub: user.id,
        iat: Math.floor(Date.now() / 1000),
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

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
    await database.query(
      "CREATE TABLE IF NOT EXISTS public.users (id serial PRIMARY KEY, name varchar(255) NOT NULL, email varchar(255) NOT NULL, password varchar(255), created_at timestamp NOT NULL DEFAULT NOW());",
    );

    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    const emailExists = queryResult.rows[0];

    if (emailExists) {
      throw new ApiError("Email already registered");
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    const user = await database.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword],
    );

    const jwtSecret = process.env.JWT_SECRET ?? "";

    const token = await sign(
      {
        sub: user.rows[0].id,
        iat: Math.floor(Date.now() / 1000),
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    const tokenReturn: IResponse = {
      token,
      user: {
        name: name,
        email: email,
      },
    };

    return tokenReturn;
  }

  static async list(page: number, itensPerPage: number): Promise<QueryResult> {
    const queryResult = await database.query(
      "SELECT users.*, count(*) over() as qtdusers FROM users LIMIT $1 OFFSET $2",
      [itensPerPage, (page - 1) * itensPerPage],
    );

    const users = queryResult;

    return users;
  }

  static async findById(id: string): Promise<User> {
    const queryResult = await database.query(
      "SELECT name, email, created_at FROM users WHERE id = $1",
      [id],
    );

    const user = queryResult.rows[0];
    return user;
  }

  static async update({
    name,
    email,
    password,
    id,
  }: IRequest): Promise<IResponse> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    const atualData = await database.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );

    const emailDifferent = queryResult.rows[0];
    const user = atualData.rows[0];

    if (emailDifferent) {
      throw new ApiError("Email already registered!");
    }

    await database.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
      [
        name ?? user.name,
        email ?? user.email,
        (await bycrypt.hash(password, 10)) ?? user.password,
        id,
      ],
    );

    const userUpdated: IResponse = {
      user: {
        name: name ?? user.name,
        email: email ?? user.email,
      },
    };

    return userUpdated;
  }

  static async delete(id: string): Promise<Number | null> {
    const queryResult = await database.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );

    const user = queryResult.rows[0];

    if (!user) {
      throw new ApiError("User not found!");
    }
    const deleted = await database.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    return deleted.rowCount;
  }

  static async paginate(
    queryResult: QueryResult,
    page: number,
    itensPerPage: number,
  ): Promise<IPaginatedUsers> {
    const totalRecords: number = parseInt(queryResult.rows[0].qtdusers);
    const totalPages: number = Math.ceil(totalRecords / itensPerPage);

    const userList = queryResult.rows;
    const mappedUser: UserWithoutPassword[] = userList.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
    });

    const paginatedResults: IPaginatedUsers = {
      users: [...mappedUser],
      pagination: {
        total_records: totalRecords,
        current_page: page,
        total_pages: totalPages,
        next_page: page + 1 > totalPages ? null : page + 1,
        prev_page: page > 1 ? page - 1 : null,
      },
    };
    return paginatedResults;
  }
}

export { UserUseCase };
