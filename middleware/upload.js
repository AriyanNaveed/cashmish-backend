import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // specify the file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },// 5MB
});

export default upload;
