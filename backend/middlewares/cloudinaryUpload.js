const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary/cloudinary");

const getUploader = (folderName) => {
  try {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folderName,
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
    });

    return multer({ storage });
  } catch (error) {
    console.log("Multer Error", error);
    res.status(500).json({success:false,  message: "Internal Server Error" });
  }
};

module.exports = getUploader;
