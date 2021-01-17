const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const {
  getUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../../controllers/api/Users");

router
  .route("/")
  .get(getUsers)
  .post(
    [
      check("email", "Please enter a valid email").isEmail().normalizeEmail(),
      check("password", "A password must be 6 digits long").isLength({
        min: 6,
      }),
      check("name", "Please fill the name").not().isEmpty(),
    ],
    addUser
  );
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
