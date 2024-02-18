const express = require("express");
const {
  postCreateCtrl,
  postDetailsCtrl,
  postFetchCtrl,
  postDeleteCtrl,
  postUpdateCtrl,
} = require("../../controllers/posts/posts");
const multer = require("multer");
const postRoutes = express.Router();
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Post = require("../../model/post/Post");

//instance of multer
const upload = multer({ storage });

//forms
postRoutes.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});

postRoutes.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});
//POST/api/v1/posts
postRoutes.post("", protected, upload.single("file"), postCreateCtrl);
//GET/api/v1/posts
postRoutes.get("", postDetailsCtrl);
//GET/api/v1/posts/:id
postRoutes.get("/:id", postFetchCtrl);
//DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, postDeleteCtrl);
//PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("file"), postUpdateCtrl);

module.exports = postRoutes;
