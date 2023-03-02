let express = require("express");
let router = express.Router();
let usersController = require("../controllers/user");
let authController = require("../controllers/auth");

/* GET users listing. */
router.get("/me", authController.requireAuth, usersController.myprofile);

router.post("/signup", usersController.signup);

router.post("/signin", usersController.signin);

module.exports = router;
