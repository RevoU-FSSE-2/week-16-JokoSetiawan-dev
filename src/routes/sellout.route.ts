import express from "express";
const selloutRoutes = express.Router();
import selloutController from "../controller/sellout.controller";
import {authenticationMiddleware, authorizationMiddleware} from "../middleware/auth.middleware"

selloutRoutes.get("/", authorizationMiddleware({role:['admin', 'sales']}), selloutController.findAllSellout);
selloutRoutes.get("/:id", authorizationMiddleware({role:['admin', 'sales']}), selloutController.findSelloutId);
selloutRoutes.post("/", authorizationMiddleware({role:['sales']}), selloutController.inputSellout);
selloutRoutes.put("/:id", authorizationMiddleware({role:['sales']}), selloutController.updateSelloutData);
selloutRoutes.delete("/:id", authorizationMiddleware({role:['sales']}), selloutController.deleteSellout);

export default selloutRoutes;
