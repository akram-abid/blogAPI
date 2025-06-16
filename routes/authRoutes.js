const { Router } = require("express");
const authController = require("../controllers/authcontroller")
const router =  Router();

router.post("/login", authController.authenticateUser)
