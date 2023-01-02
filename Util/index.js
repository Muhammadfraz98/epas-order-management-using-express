let secret = "helloworld";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let methods = {
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
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECERET,
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
        var CloudinaryObj = methods.configCloudinary();
        CloudinaryObj.uploader
          .upload(file.filepath)
          .then((result) => {
            return resolve(result.secure_url);
          })
          .catch((err) => {
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
