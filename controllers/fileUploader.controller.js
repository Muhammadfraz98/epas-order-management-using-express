import util from "../Util/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let methods = {
  uploadFile: async (req, res) => {
    try {
      let files = req.files;
      let file = files.file;
      let uploadFile = await util.uploadFileToCloudinary(file);
      res.status(200).json({
        message: "file uploaded",
        succsess: true,
        data: uploadFile,
      });
    } catch (error) {
      console.log(`error is--> ${error}`);
      res.status(500).json({
        error: error,
      });
    }
  },

  uploadFiletoLocalserver: async (req, res) => {
    try {
      ///////////////////
      let files = req.files;
      console.log("files --- > ", files);
      let currentdate = new Date(Date.now());
      let file = files.file;
      let FileFormat = req.body.FileFormat;
      if (!file) throw "Error! No file found !";
      if (!FileFormat) throw "Error ! no format found! ";
      console.log("file ----> ", file);

      let filename = file.name;
      let result = await util.uploadFileToLocalServer(
        file,
        "./public/uploadedFiles/",
        FileFormat
      );

      let uploadedfilePtah = path.resolve(
        __dirname,
        `../public/uploadedFiles/${result}`
      );
      let imageData = {
        imageurl: "/uploadedFiles/" + result,
      };

      return res.status(200).json({
        success: true,
        msg: "file uploaded  successfully",
        data: uploadedfilePtah,
      });
    } catch (error) {
      console.log(`error is ${error}`);
      res.status(500).json({
        msg: "can not upload file ",
        error: error,
      });
    }
  },
};

export default methods;
