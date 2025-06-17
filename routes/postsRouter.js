const {Router} = require("express")
const postsController = require("../controllers/postsController")
const router = Router();
const validator = require("../dto/index")
const authController = require("../controllers/authcontroller")

router.use(authController.authenticateToken);

router.get("/", postsController.getAllPosts)
router.get("/:postId", postsController.getPostById)
router.get("/:postId/comment", postsController.getPostComments)
router.post("/:postId/comment", validator.validateCreateComment, postsController.createNewComment)
router.post("/", validator.validateCreatePost, postsController.createPost);
router.put("/:postId", validator.validateUpdatePost, postsController.updatePost);
router.delete("/:postId", postsController.deletePost);
router.get("/unpublished", postsController.getUnpublishedPosts)

module.exports = router