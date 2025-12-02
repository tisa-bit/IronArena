import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "attachment") {
      cb(null, "uploads/controls");
    } else if (file.fieldname === "profilePic") {
      cb(null, "uploads/profilepic");
    } else if (file.fieldname === "companyLogo") {
      cb(null, "uploads/companyLogo"); // folder for company logos
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "attachment") {
    const allowedMime = ["application/pdf"];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(new Error("Only PDF files allowed for controls"), false);
    }
  } else if (file.fieldname === "profilePic") {
    const allowedMime = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(new Error("Only images allowed for profile picture"), false);
    }
  } else if (file.fieldname === "companyLogo") {
    const allowedMime = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(new Error("Only images allowed for company logo"), false);
    }
  } else {
    return cb(new Error("Invalid field name"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
