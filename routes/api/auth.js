const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const user = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { token } = require("morgan");
const config = require("config");

// @desc  Get Auth Token
// Route GET /api/v1/auth
router.get("/", auth, async (req, res) => {
  try {
    const data = await user.findById(req.user.id, "-password");
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        msg: "Internal Server Error",
      },
    });
  }
});

router.post(
  "/",
  [
    check("email", "Enter a valid email").isEmail().normalizeEmail(),
    check("password").isEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check User is present in DB
      const checkUser = await user.findOne({ email: email });
      if (!checkUser) {
        return res
          .status(401)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }
      // Check password

      const comparedPassword = await bcrypt.compare(
        password,
        checkUser.password
      );
      if (!comparedPassword) {
        return res
          .status(401)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }
      // Providing User JWT Token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.get("data.jwtSecret"), (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: "Internal Server Error" });
        }
        res.status(201).json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: [{ msg: "Internal Server Error" }] });
    }
  }
);

module.exports = router;
