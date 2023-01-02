import express from "express";

const router = express.Router();

import userController from "../controllers/user.controller.js";

import orderController from "../controllers/order.controller.js";

router.post("/user/login", userController.userLogin);

router.post("/user/addUser", userController.createUser);

router.post("/order/addOrder");

export default router;
