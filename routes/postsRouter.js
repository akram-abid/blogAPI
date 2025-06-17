const {Router} = require("express")
const postsController = require("../controllers/postsController")
const router = Router();
const validator = require("../dtos/index")
const authController = require("../controllers/authController")

router.use(authController.authenticateToken);

router.get("/", postsController.getAllPosts)
router.post("/", validator.validateCreatePost, postsController.createPost);
router.get("/:postId", postsController.getPostById)
router.get("/:postId/comments", postsController.getPostComments)
router.post("/:postId/comment", validator.validateCreateComment, postsController.createNewComment)
router.put("/:postId", validator.validateUpdatePost, postsController.updatePost);
router.delete("/:postId", postsController.deletePost);
router.get("/unpublished", postsController.getUnpublishedPosts)

module.exports = router