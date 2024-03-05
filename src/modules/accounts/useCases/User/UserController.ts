import { Request, Response } from "express";
import { UserUseCase } from "./UserUseCase";

class UserController {
  async authenticate(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    try {
      const token = await UserUseCase.authenticate({
        password,
        email,
      });

      return response.json(token);
    } catch (error) {
      return response.json(error);
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { password, email, name } = request.body;

    try {
      const token = await UserUseCase.create({
        name,
        password,
        email,
      });

      return response.json(token);
    } catch (error) {
      return response.json(error);
    }
  }

  async findById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const user = await UserUseCase.findById(id);

    return response.json(user);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const { page, itensPerPage } = request.query;
    try {
      const UserList = await UserUseCase.list(
        Number(page),
        Number(itensPerPage),
      );

      return response.json(UserList);
    } catch (error) {
      return response.json(error);
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { password, email, name } = request.body;
    const { id } = request.params;
    try {
      const user = await UserUseCase.update({
        name,
        password,
        email,
        id,
      });

      return response.json(user);
    } catch (error) {
      return response.json(error);
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      const deleted = await UserUseCase.delete(id);

      return response.json(deleted);
    } catch (error) {
      return response.json(error);
    }
  }
}

export { UserController };
