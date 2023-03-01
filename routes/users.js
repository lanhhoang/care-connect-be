const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  userList,
  userProfile,
} = require("../controllers/user");
const { requireAuth, requireAdmin } = require("../controllers/auth");

/* GET users listing. */
router.get("/list", requireAuth, requireAdmin, userList);

/* GET user profile. */
router.get("/me", requireAuth, userProfile);

router.post("/signup", signup);

router.post("/signin", signin);

/* PUT update user */
//router.put("/edit/:id", usersController.userEdit);
router.put("/edit/:id", authController.requireAuth, usersController.userEdit);

module.exports = router;
