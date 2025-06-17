const { Router } = require("express");
const commentController = require("../controllers/commentController")
const router =  Router();
const validator = require("../dtos/index")
const authController = require("../controllers/authController")

router.use(authController.authenticateToken);


router.delete("/:commentId", commentController.deleteComment)
router.put("/:commentId", validator.validateUpdateComment, commentController.updateComment)

module.exports = router
