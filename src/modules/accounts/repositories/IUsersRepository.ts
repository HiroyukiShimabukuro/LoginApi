import { User } from "../dtos/User";

interface IUsersRepository {
  create(data: User): Promise<User>;
  list(page: number): Promise<User>;
  findById(id: number): Promise<User>;
  update(id: number): Promise<void>;
  delete(id: number): Promise<void>;
  authenticate(email: string, password: string): Promise<User>;
}

export { IUsersRepository };
