const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { isLogin, isAdmin } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/files/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const storagePicture = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const uploadImages = multer({
  storage: storagePicture,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

router.post(
  "/file",
  isLogin,
  isAdmin,
  upload.single("file"),
  function (req, res) {
    const { host } = req.headers;
    const fullUrl = req.protocol;
    const urlFile = `https://tweet-vector.herokuapp.com/uploads/${req.file.filename}`;
    res.send({
      status: 200,
      message: "Your file is successfully uploaded",
      fileUrl: urlFile,
    });
  }
);

router.post("/image", uploadImages.single("file"), function (req, res) {
  // const prodUrl = "https://tweet-vector.herokuapp.com";
  const devUrl = "http://localhost:4000";
  const urlFile = `${devUrl}/images/${req.file.filename}`;
  res.send({
    status: 200,
    message: "Your file is successfully uploaded",
    fileUrl: urlFile,
  });
});

module.exports = router;
