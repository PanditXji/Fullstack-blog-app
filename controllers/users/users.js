const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

// User register controller
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  console.log(req.body);
  //check if field is empty
  if (!fullname || !email || !password) {
    // return next(appErr("All fields are required"));
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    //1. check if user exist ( email )
    const userFound = await User.findOne({ email });
    //throw an error
    if (userFound) {
      return res.render("users/register", {
        error: "Email is Already exist",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    //register User
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};
// User login controller
const loginCtrl = async (req, res, next) => {
  console.log(req.session);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", {
      error: "Email and Password fields are required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid Login Credentials",
      });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid Login Credentials",
      });
    }
    //save the user into
    req.session.userAuth = userFound._id;
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};
// User details controller
const userDetailsCtrl = async (req, res) => {
  try {
    //get user id from params
    const userID = req.params.id;
    // find the user
    const user = await User.findById(userID);
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    res.render("users/updateUser", {
      error: error.message,
    });
  }
};
// User profile controller
const userProfileCtrl = async (req, res) => {
  try {
    // get the login user
    const userID = req.session.userAuth;
    //find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};
// upload profile photo
const userProfileUpdatedCtrl = async (req, res) => {
  try {
    //check if file is exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    //1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    //3. Update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
// Upload cover-photo
const userCoverPhotoCtrl = async (req, res) => {
  try {
    //check if file is exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    //1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "User not found",
      });
    }
    //3. Update cover photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
// User password-update controller
const userPasswordUpdateCtrl = async (req, res) => {
  const { password } = req.body;
  try {
    //check if user is updating a password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      //update the user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.render("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("users/updatePassword", {
      error: error.message,
    });
  }
};
// User update controller
const userUpdatedCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please provide details",
        user: "",
      });
    }
    //check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "Email is Taken",
          user: "",
        });
      }
    }
    //update the user
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};
// User logout controller
const userLogoutCtrl = async (req, res) => {
  //destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  userProfileUpdatedCtrl,
  userCoverPhotoCtrl,
  userPasswordUpdateCtrl,
  userUpdatedCtrl,
  userLogoutCtrl,
};
