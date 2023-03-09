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

module.exports = router;
