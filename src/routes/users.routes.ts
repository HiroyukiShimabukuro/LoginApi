import { Router } from "express";
import { UserController } from "../modules/accounts/useCases/User/UserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const usersRoutes = Router();
const userController = new UserController();

usersRoutes.post("/register", userController.create);
usersRoutes.post("/auth", userController.authenticate);

usersRoutes.get("/", isAuthenticated, userController.list);
usersRoutes.get("/:id", isAuthenticated, userController.findById);

usersRoutes.put("/update/:id", isAuthenticated, userController.update);
usersRoutes.delete("/delete/:id", isAuthenticated, userController.delete);

export { usersRoutes };
