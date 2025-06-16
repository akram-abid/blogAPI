const {Router} = require("express")
const postsController = require("../controllers/postsController")
const router = Router();

router.get("/", postsController.getAllPosts)
router.get("/:postId", postsController.getPostById)
router.post("/:postId/comment", postsController.createNewComment)

module.exports = router