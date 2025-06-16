const { Router } = require("express");
const commentController = require("../controllers/commentController")
const router =  Router();

router.delete("/:commentId", commentController.deleteComment)
router.put("/:commentId", commentController.updateComment)

module.exports = router
