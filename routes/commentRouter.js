const { Router } = require("express");
const commentController = require("../controllers/commentController")
const router =  Router();
const validator = require("../dto/index")
const authController = require("../controllers/authcontroller")

router.use(authController.authenticateToken);


router.delete("/:commentId", commentController.deleteComment)
router.put("/:commentId", validator.validateUpdateComment, commentController.updateComment)

module.exports = router
