import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let methods = {
  addOrder: async (req, res) => {
    try {
      let userId = req.token._id;
      for (var i in req.token) {
        console.log(`token is ${i} ==> `);
      }

      let data = req.body;
      if (!data || !userId) throw "invalid request! no data found !";
      data.userId = userId;
      let orderData = new Order(data);
      let addData = await orderData.save();
      res.status(200).json({
        msg: "order added !",
        data: addData,
        Success: true,
      });
    } catch (error) {
      console.log(`error is ${error}`);
      res.status(500).json({
        msg: "can not add order !",
        error: error,
        Success: false,
      });
    }
  },

  ViewOrders: async (req, res) => {
    try {
      console.log(`token is ${req.token._id}`);
      let userId = req.token._id;
      let user = await User.findOne({ _id: userId });
      if (!user) throw "Invalid request! No user found !";
      let role = user.role;
      let orders = [];
      if (role == "ENDUSER") {
        console.log("end user order ! and user id is ", userId);

        orders = await Order.find({ userId: userId })
          .sort({ createdAt: -1 })
          .limit(250);

        console.log("orders are ", orders);
      } else {
        console.log("admin user");
        orders = await Order.find().sort({ createdAt: -1 }).limit(250);
      }

      res.status(200).json({ data: orders, Success: true });
    } catch (error) {
      console.log(`error is ${error}`);
      res.status(500).json({
        msg: "can not view order !",
      });
    }
  },

  UpdateOrder: async (req, res) => {
    try {
      let data = req.body;
      let user_id = req.token._id;
      let user = await User.findOne({ _id: user_id });
      if (!user) throw "can not find user !";

      let role = user.role;
      if (role !== "SUPPLIER" || role != "ADMIN") {
        throw "You havent permission to update order ";
      }
      let _id = data._id;
      delete data._id;
      let updateOrder = await Order.findOneAndUpdate({ _id: _id }, data);

      res.status(200).json({
        message: "order updated !",
        Success: true,
      });
    } catch (error) {
      console.log("error is ", error);
      res.status(500).json({
        message: "can not update order !",
        error: error,
      });
    }
  },

  orderDetail: async (req, res) => {
    try {
      let _id = req.query.orderId;
      let order = await Order.findOne({
        _id,
      });
      if (!order) {
        return res.status(404).json({
          msg: "no order found !",
          error: error,
        });
      }
      res.status(200).json({
        msg: "order retrived",
        Success: true,
        data: order,
      });
    } catch (error) {
      console.log("error is ", error);
      res.status(500).json({
        error: error,
        msg: "can not laod order",
      });
    }
  },

  viewFile: async (req, res) => {
    try {
      let file = path.resolve(
        __dirname,
        "../public/uploadedFiles/WhatsAppImage2022-12-30at123508jpeg512023121744.jpeg"
      );
      res.status(200).json({
        filename: file,
        Success: true,
      });
    } catch (error) {
      console.log("error is  -->", error);
      res.status(500).json({
        msg: "can not view file !",
        error: error,
      });
    }
  },
};

export default methods;
