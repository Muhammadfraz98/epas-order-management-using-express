import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import utils from "../Util/index.js";

let methods = {
  //**** Create Admin User */
  createUser: async (req, res) => {
    try {
      console.log(`user signup api called !`);
      let data = req.body;

      data.password = await bcrypt.hash(data.password, 10);
      let email = data.email;
      console.log("email is ", email);

      let IsUserExit = await User.findOne({ email: email });
      if (IsUserExit) {
        res.status(409).json({
          msg: "user already exist with this email or phone number",
          Success: false,
        });
      } else {
        // let emailToken = await utils.generateRandomToken(10);

        // data.emailVerifiedToken = emailToken;
        // data.IsVerified = 0;
        // data.shopifyCustomerId = customer.id;
        // await mailService.sendEmailVerifiedToken(data.email, emailToken);

        let user = new User(data);

        let Adduser = await user.save();

        if (!Adduser) throw "User cannot be added!";

        res.status(200).json({
          success: true,
          msg: `User has been created !`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "error server error",
        error: error,
        msg: error.msg,
        Success: false,
      });
    }
  },

  //*** Admin User Login */
  userLogin: async (req, res) => {
    try {
      let data = req.body;
      console.log(data);
      let email = data.email;
      let password = data.password;

      if (!email || !password)
        throw "Error! Invalid request email and password not found ";

      let user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({
          msg: "user not found with this email !",
          Success: false,
        });
      } else {
        let match = await utils.comparePassword(password, user.password);

        if (!match) {
          res.status(401).json({
            msg: "invalid password !",
            Success: false,
          });
        } else {
          let access_token = await utils.issueToken({ _id: user._id });

          let result = {
            user: {
              _id: user._id,
              email: user.email,
              userName: user.userName,
            },

            access_token,
          };

          return res.status(200).json({ success: true, result });
        }
      }
    } catch (error) {
      console.log(error);

      res
        .status(501)
        .json({ success: false, msg: "Error! Invalid request", error });
    }
  },

  //*** Resend Verification Code */
  resendVerificationCode: async (req, res) => {
    try {
      let email = req.body.email;
      if (!email) throw "invalid request !";

      let user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          msg: "no user found against this email",
          Success: false,
        });
      } else {
        let data = {};
        let emailToken = await utils.generateRandomToken(10);
        data.emailVerifiedToken = emailToken;
        data.IsVerified = 0;

        let updateUser = await User.findOneAndUpdate({ email: email }, data);

        await mailService.sendEmailVerifiedToken(email, emailToken);

        res.status(200).json({
          msg: "verification code resend. Kindly Check your email!",
        });
      }
    } catch (error) {
      console.log(`error is ${error}`);
      res.status(500).json({
        msg: "can not send verification code !",
        error: error,
        Success: false,
      });
    }
  },

  //** Validation */
  validation: async (req, res) => {
    console.log("Customer Validate called");
    try {
      const { id } = req.token;
      console.log("req.token is ", req.token);
      let customer = await model.User.findByPk(id);
      if (!customer) throw "Error! Invalid token";
      let access_token = await utils.issueToken({
        id: customer.dataValues.id,
      });
      let result = {
        user: {
          id: customer.dataValues.id,
          fullname: customer.dataValues.fullname,
          email: customer.dataValues.email,
          Contact: customer.dataValues.Contact,
          role: customer.dataValues.role,
          customer_type: customer.dataValues.customer_type,
          customer_sale_type: customer.customer_sale_type,
        },
        access_token,
      };
      if (!result) throw "cant login";
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, msg: "Invalid Token", error });
    }
  },

  //*** Email Verification  */
  emailVerification: async (req, res) => {
    console.log("Email verification Called");
    try {
      let email = req.body.email;
      let emailVerifiedToken = req.body.emailVerifiedToken;

      if (
        email &&
        email !== "" &&
        emailVerifiedToken &&
        emailVerifiedToken !== null
      ) {
        let user = await User.findOne({
          email: email,
          emailVerifiedToken: emailVerifiedToken,
        });
        if (user) {
          console.log("user found !");
          user.IsVerified = 1;
          user.emailVerifiedToken = "";
          await user.save();

          let access_token = await utils.issueToken({ _id: user._id });

          let result = {
            user: {
              _id: user._id,
              email: user.email,
              UserName: user.UserName,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              ContactNumber: user.ContactNumber,
              DateOfBirth: user.DateOfBirth,
              shopifyCustomerId: user.shopifyCustomerId,
            },

            access_token,
          };

          return res.status(200).json({
            success: true,
            msg: "Email verified successfully",
            data: result,
          });
        } else {
          console.log("User not found");
          return res.status(401).json({ success: false, msg: "No User found" });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, msg: "Incompelete data" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, msg: "No User found" });
    }
  },

  //*** Change Password ! */
  ChangePassword: async (req, res) => {
    try {
      console.log("req.token is ", req.token);
      let _id = req.token._id;
      if (!_id) throw "invalid token!";

      let oldPassword = req.body.oldPassword;
      let password = req.body.password;
      let password2 = req.body.password2;

      if (password !== password2) throw "Error! passwords do not match";

      let user = await User.findOne({ _id });
      if (!user) throw "Error! no customer found";
      let match = await utils.comparePassword(oldPassword, user.password);
      if (!match) throw "Error! wrong password";

      user.password = await utils.hashPassword(password);
      await user.save();
      return res
        .status(200)
        .json({ success: true, msg: "Password Changed Successfully." });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, msg: "Invalid request", error });
    }
  },

  //**** Forget password ! */
  ForgetPassword: async (req, res) => {
    try {
      let email = req.body.email;

      let user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          msg: "no user found  against this email !",
          success: false,
        });
      } else {
        let emailToken = await utils.generateRandomToken(10);
        user.passwordResetToken = emailToken;
        await mailService.sendForgetPasswordToken(email, emailToken);
        await user.save();

        res.status(200).json({
          msg: "A verification Token has been send to your email. Kindly Check your email",
          success: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        msg: "can not send forget password token !",
      });
    }
  },

  //*** reset Password  */
  resetPassword: async (req, res) => {
    try {
      let email = req.body.email;
      let passwordResetToken = req.body.passwordResetToken;
      let password = req.body.password;
      let password2 = req.body.password2;
      console.log(req.body);
      if (password !== password2) {
        return res
          .status(401)
          .json({ success: false, msg: "Passwords do not match" });
      }

      if (
        email &&
        email !== "" &&
        passwordResetToken &&
        passwordResetToken !== ""
      ) {
        let user = await User.findOne({
          email: email,
          passwordResetToken: passwordResetToken,
        });
        if (!user) {
          return res.status(401).json({ success: false, msg: "No user found" });
        }
        user.passwordResetToken = "";
        user.password = await utils.hashPassword(password);
        await user.save();
        return res
          .status(200)
          .json({ success: true, msg: "Password Changed Successfully." });
      } else {
        //change pass through customer profile here
        console.log("Invalid request");
        return res.status(401).json({ success: false, msg: "Invalid request" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, msg: "Invalid request" });
    }
  },

  //*** Update User Profile  */
  UpdateuserProfile: async (req, res) => {
    try {
      let data = req.body;
      data.updatedAt = new Date(Date.now());
      let _id = data._id;
      delete data._id;
      let updateUserProfile = await User.findOneAndUpdate({ _id }, data);
      let userdata = await User.findOne({ _id });
      if (!userdata) throw "can not find user data !";
      res.status(200).json({
        msg: "user data updated !",
        data: userdata,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        error: error,
        Success: false,
      });
    }
  },

  //*** Get Users  */
  GetUsers: async (req, res) => {
    try {
      let condition = {};
      if (req.body._id) {
        condition._id = req.body._id;
      }
      if (req.body.email) {
        condition.email = req.body.email;
      }
      let users = await User.find(condition);
      res.status(200).json({
        users: users,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        msg: "can not load user !",
        error: error,
        Success: false,
      });
    }
  },

  //*** Delete Users */
  DeleteUser: async (req, res) => {
    try {
      let email = req.body.email;
      let user = await User.deleteMany({ id: { $gt: 1 } });
      res.status(200).json({
        msg: "user deleted !",
        Success: true,
      });
    } catch (error) {
      res.status({
        error: error,
        msg: "user not deleted ",
        Success: false,
      });
    }
  },
};

export default methods;
