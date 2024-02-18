const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  userProfileUpdatedCtrl,
  userCoverPhotoCtrl,
  userPasswordUpdateCtrl,
  userUpdatedCtrl,
  userLogoutCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");

const userRoutes = express.Router();

//instance of multer
const upload = multer({ storage });

//----------
// Rendering forms
//--------
//---login form -----
userRoutes.get("/login", (req, res) => {
  res.render("users/login", { error: "" });
});
//----Register form ------
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

//----upload profile photo ------
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});
//----upload cover photo ------
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", {
    error: "",
  });
});
// ----update User password ------
userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});

//register
userRoutes.post("/register", upload.single("profile"), registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/profile
userRoutes.get("/profile-page", protected, userProfileCtrl);
//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  userProfileUpdatedCtrl
);
//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload",
  protected,
  upload.single("profile"),
  userCoverPhotoCtrl
);
//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password", userPasswordUpdateCtrl);
//PUT/api/v1/users/update/:id
userRoutes.put("/update", userUpdatedCtrl);
//GET/api/v1/users/logout
userRoutes.get("/logout", userLogoutCtrl);
//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);
module.exports = userRoutes;
