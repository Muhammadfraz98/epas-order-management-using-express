import User from "../models/user.model.js";
import Order from "../models/order.model.js";
let methods = {
  addOrder: async (req, res) => {
    try {
      let userId = req.token._id;
      let data = req.body.data;
      if (!data || !userId) throw "invalid request! no data found !";
      data.userId = userId;
      let orderData = new Order(orderData);
      let addData = await data.save();
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
      let userId = req.token._id;
      let user = await User.findOne({ _id: userId });
      if (!user) throw "Invalid request! No user found !";
      let role = user.role;
      let orders = [];
      if (role == "ENDUSER") {
        orders = await Order.find({ user_id })
          .sort({ createdAt: -1 })
          .limit(250);
      } else {
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
      delete data.user_id;
    } catch (error) {}
  },
};

export default methods;
