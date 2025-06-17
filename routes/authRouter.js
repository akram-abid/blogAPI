const { Router } = require("express");
const authController = require("../controllers/authController")
const router =  Router();
const { validateRegister, validateLogin } = require('../dtos');

router.post("/login", validateLogin, authController.authenticateUser)
router.post("/signup", validateRegister, authController.createNewUser)

module.exports = router
