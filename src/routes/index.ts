import { Router } from "express";
import { usersRoutes } from "./users.routes";

const router = Router();
console.log(2, router);

router.use("/users", usersRoutes);

export { router };
