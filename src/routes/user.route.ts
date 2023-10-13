import express from "express";
const userRoutes = express.Router();
import userController from "../controller/user.controller";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";

userRoutes.post(
  "/",
  authorizationMiddleware({ role: ["admin"] }),
  userController.createUser
);
userRoutes.get(
  "/",
  authorizationMiddleware({ role: ["admin"] }),
  userController.findAllUser
);
userRoutes.get(
  "/:id",
  authorizationMiddleware({ role: ["admin", "sales"] }),
  userController.findUserId
);
userRoutes.put(
  "/:id",
  authorizationMiddleware({ role: ["admin"] }),
  userController.updateUserData
);
userRoutes.delete(
  "/:id",
  authorizationMiddleware({ role: ["admin"] }),
  userController.deleteUser
);

export default userRoutes;
