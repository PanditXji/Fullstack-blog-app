const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// Post create controller
const postCreateCtrl = async (req, res, next) => {
  const { title, description, category, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", { error: "All fields are required" });
    }
    //Find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    //create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    //push the post created into the array of user's post
    userFound.posts.push(postCreated._id);
    //re save
    await userFound.save();
    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", { error: error.message });
  }
};
// all post
const postDetailsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").populate("user");
    res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};
// details post
const postFetchCtrl = async (req, res, next) => {
  try {
    // get the id from params
    const id = req.params.id;
    //find the post
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
    res.render("posts/postDetails", {
      post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};
// Post Delete controller
const postDeleteCtrl = async (req, res, next) => {
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belong to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "You are not authorized to delete the post",
        post,
      });
    }
    //delete
    await Post.findByIdAndDelete(req.params.id);
    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", {
      error: error.message,
      post: "",
    });
  }
};
// Post Update controller
const postUpdateCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belong to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        post: "",
        error: "You are not authorized to update this post ",
      });
    }
    //check if user is updating image
    if (req.file) {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      //update
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }

    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      post: "",
      error: error.message,
    });
  }
};
module.exports = {
  postCreateCtrl,
  postDetailsCtrl,
  postFetchCtrl,
  postDeleteCtrl,
  postUpdateCtrl,
};
