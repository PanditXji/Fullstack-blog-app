const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// Comment create controller
const commentCreateCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: post._id,
    });
    //push the comment to the post
    post.comments.push(comment._id);
    //find the user
    const user = await User.findById(req.session.userAuth);
    //push the comment into user
    user.comments.push(comment._id);
    //disable validation
    //save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    console.log(post);
    //redirect
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error));
  }
};
//  Signle
const commentFetchCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render("comments/updateComment", {
      comment,
      error: "",
    });
  } catch (error) {
    res.render("comments/updateComment", {
      error: error.message,
    });
  }
};
// Comment Delete controller
const commentDeleteCtrl = async (req, res, next) => {
  console.log(req.query.postId);
  try {
    //find the post
    const comment = await Comment.findById(req.params.id);
    //check if the post belong to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete the comment", 403));
    }
    //delete
    await Comment.findByIdAndDelete(req.params.id);
    //redirect
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};
// Comment Update controller
const commentUpdateCtrl = async (req, res, next) => {
  try {
    //find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment not Found"));
    }
    //check if the comment belong to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete the post", 403));
    }
    //updated comment
    const commentUpdated = await Comment.findById(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};
module.exports = {
  commentCreateCtrl,
  commentFetchCtrl,
  commentDeleteCtrl,
  commentUpdateCtrl,
};
