let secret = "helloworld";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import resolve from "path";
import formidable from "formidable";

let methods = {
  uploadFileToLocalServer: (file, path, FileFormat) => {
    return new Promise((resolve) => {
      try {
        let sampleFile = file;
        let x = new Date();
        let filename =
          file.name +
          "" +
          x.getDate() +
          "" +
          x.getMonth() +
          "" +
          x.getFullYear() +
          "" +
          x.getHours() +
          "" +
          x.getMinutes() +
          "" +
          x.getSeconds() +
          "." +
          FileFormat;
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(path + filename, (err) => {
          if (err) {
            throw err;
          }
          resolve(filename);
        });
      } catch (err) {
        throw err;
      }
    });
  },
  hashPassword: (password) => {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, 10, (err, passwordHash) => {
        if (err) {
          reject(err);
        } else {
          resolve(passwordHash);
        }
      });
    });
  },

  comparePassword: (pw, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pw, hash, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  issueToken: (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        { expiresIn: "265 days" },
        function (err, token) {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  },
  generateRandomToken: (length) => {
    return new Promise((resolve, reject) => {
      // crypto.randomBytes(length, function (err, buffer) {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(buffer.toString("hex"));
      //   }
      // });

      var r = Math.random();
      let number = Math.floor(r * (999999 - 99999) + 99999);
      resolve(number);
    });
  },

  verifyToken: (token, cb) => jwt.verify(token, secret, {}, cb),

  configCloudinary: () => {
    cloudinary.config({
      cloud_name: "dr93dv5qy",
      api_key: "836564686949554",
      api_secret: "MhP8xdjFcCU4K4NtGfeOBGNMTp0",
    });
    return cloudinary;
  },

  uploadFileToS3: () => {},

  uploadFileToCloudinary: async (file) => {
    return new Promise((resolve, reject) => {
      let fileExtension = file.mimetype.split("/").pop();

      fileExtension = fileExtension.toUpperCase();

      let fileType = methods.findFileType(fileExtension);

      if (fileType === "Image") {
        //   console.log("fileis -->", file);
        console.log("file type is image ");
        console.log(`file path is ${file.name}`);
        // return resolve(file);
        var CloudinaryObj = methods.configCloudinary();
        CloudinaryObj.uploader
          .upload(file.name)
          .then((result) => {
            return resolve(result.secure_url);
          })
          .catch((err) => {
            console.log(`error is ${err}`);
            return reject(err);
            // console.log(`error is ${err}`);
          });
      }
      if (fileType === "Video") {
        //   console.log("fileis -->", file);
        console.log("file type is video ");
        var CloudinaryObj = methods.configCloudinary();
        CloudinaryObj.uploader
          .upload(file.filepath, { resource_type: "video" })
          .then((result) => {
            return resolve(result.secure_url);
          })
          .catch((err) => {
            return reject(err);
            // console.log(`error is ${err}`);
          });
      }

      if (fileType === "Other") {
        console.log("file type is video ");
        var CloudinaryObj = methods.configCloudinary();
        CloudinaryObj.uploader
          .upload(file.filepath, { resource_type: "raw" })
          .then((result) => {
            return resolve(result.secure_url);
          })
          .catch((err) => {
            return reject(err);
            // console.log(`error is ${err}`);
          });
      }
    });
  },

  uploadFileToFtp: () => {},

  findFileType: (fileExtension) => {
    console.log(`file extension is ${fileExtension}`);
    let imagesFileExtensions = new Set([
      "JPEG",
      "PNG",
      "GIF",
      "TIFF",
      "PSD",
      "PDF",
      "EPS",
      "AI",
      "INDD",
      "RAW",
    ]);

    let videoFileExtensions = new Set([
      "MP4",
      "MOV",
      "WMV",
      "AVI",
      "AVCHD",
      "FLV",
      "F4V",
      "SWF",
      "MKV",
      "WEBM",
      "HTML5",
      "MPEG-2",
    ]);

    var fileType = "Other";

    if (imagesFileExtensions.has(fileExtension) === true) {
      console.log(`extension is ${fileExtension}`);
      fileType = "Image";
    }
    if (videoFileExtensions.has(fileExtension) === true) {
      fileType = "Video";
    }

    return fileType;
  },
};

export default methods;
