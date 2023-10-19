import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import { db } from "./config/db.connection";
import userRoutes from "./routes/user.route";
import selloutRoutes from "./routes/sellout.route";
import authRoutes from "./routes/auth.route";
import resetPasswordRoutes from "./routes/resetPassword.route";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "./middleware/auth.middleware";
import errorHandlerMiddleware from "./middleware/error.handling";
import swaggerUi from "swagger-ui-express";
import * as yaml from "js-yaml"; // Import js-yaml
import { OpenApiValidator } from "express-openapi-validator/dist/openapi.validator";
import fs from "fs";
import cookieParser from "cookie-parser";

const routes = express.Router();

const app = express();
app.use(cookieParser());

const port = process.env.PORT;

app.use(bodyParser.json());

app.use(express.json());
app.use(routes);

routes.use("/auth", authRoutes);
routes.use("/user", authenticationMiddleware, userRoutes);
routes.use("/sellout", authenticationMiddleware, selloutRoutes);
routes.use("/password", resetPasswordRoutes);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
