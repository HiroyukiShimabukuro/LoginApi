import { Request, Response } from "express";
import { UserUseCase } from "./UserUseCase";

class UserController {
  async authenticate(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;
    console.log(8, UserUseCase);

    const token = await UserUseCase.authenticate({
      password,
      email,
    });

    return response.json(token);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { password, email, name } = request.body;
    console.log(8, UserUseCase);

    const token = await UserUseCase.create({
      name,
      password,
      email,
    });

    return response.json(token);
  }

  async findById(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    const token = await UserUseCase.authenticate({
      password,
      email,
    });

    return response.json(token);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    console.log(44, password, email);
    console.log(45, UserUseCase);

    const token = await UserUseCase.authenticate({
      password,
      email,
    });

    return response.json(token);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { password, email, name } = request.body;

    const token = await UserUseCase.update({
      name,
      password,
      email,
    });

    return response.json(token);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    const token = await UserUseCase.authenticate({
      password,
      email,
    });

    return response.json(token);
  }
}

export { UserController };
