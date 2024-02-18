const express = require("express");
const {
  commentCreateCtrl,
  commentFetchCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl,
} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/protected");
const commentRoutes = express.Router();

//POST/api/v1/comments
commentRoutes.post("/:id", protected, commentCreateCtrl);

//GET/api/v1/comments/:id
commentRoutes.get("/:id", commentFetchCtrl);
//DELETE/api/v1/commments/:id
commentRoutes.delete("/:id", protected, commentDeleteCtrl);
//PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, commentUpdateCtrl);

module.exports = commentRoutes;
