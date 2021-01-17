const { validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { token } = require("morgan");

// @desc  To get all users
// Route GET /api/v1/user
exports.getUsers = (req, res, next) => {
  res.send("Getting all the users");
};

// @desc  Add new User
// Route POST /api/v1/user
exports.addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const { name, email, password } = req.body;
  try {
    // User Exist ?
    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Get users gravatar
    const avatar = await gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
      protocol: "https",
    });

    const user = new User({
      name,
      email,
      password,
      avatar,
    });

    //Encrypted password
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(password, salt);
    user.password = encryptedPass;

    await user.save();

    // return JWT
    try {
      const token = jwt.sign(user.id, config.get("data.jwtSecret"));
      res.status(201).json({
        success: true,
        token,
      });
    } catch (error) {}
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: [{ msg: "Internal Server Error" }] });
  }
};

// @desc  To get a user
// Route GET /api/v1/user/:id
exports.getUser = (req, res, next) => {
  res.send(`User ${req.params.id} has been retrived successfully`);
};

// @desc  To Update a user
// Route PUT /api/v1/user/:id
exports.updateUser = (req, res, next) => {
  res.send(`User ${req.params.id} has been Updated successfully`);
};

// @desc  To Delete a user
// Route DELETE /api/v1/user/:id
exports.deleteUser = (req, res, next) => {
  res.send(`User ${req.params.id} has been Deleted successfully`);
};
