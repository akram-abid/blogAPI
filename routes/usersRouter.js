const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.patch(
  "/:userId/promote",
  authController.authenticateToken,
  userController.promoteToAdmin
);

router.delete(
  "/:userId",
  authController.authenticateToken,
  userController.deleteUser
);

router.get(
  "/admins",
  authController.authenticateToken,
  userController.getAllAdmins
);

router.get(
  "/readers",
  authController.authenticateToken,
  userController.getAllReaders
);


module.exports = router;
