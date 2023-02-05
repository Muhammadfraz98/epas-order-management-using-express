import express from "express";

import authPolicy from "../Util/authPolicy.js";

const router = express.Router();

import userController from "../controllers/user.controller.js";

import orderController from "../controllers/order.controller.js";

import fileUploader from "../controllers/fileUploader.controller.js";

router.post("/user/login", userController.userLogin);

router.post("/user/addUser", userController.createUser);

router.post("/order/addOrder", authPolicy, orderController.addOrder);

router.post("/order/viewOrder", authPolicy, orderController.ViewOrders);

router.post("/order/updateOrder", authPolicy, orderController.UpdateOrder);

router.get("/order/orderDetail", authPolicy, orderController.orderDetail);

router.post("/file/viewfile", orderController.viewFile);

router.post("/file/uploadFile", fileUploader.uploadFiletoLocalserver);

export default router;
