const PrismaClient = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { state: "published" },
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { fullname: true, id: true } },
        comments: true,
      },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        owner: { select: { fullname: true } },
        comments: true,
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

exports.createNewComment = async (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await prisma.comment.create({
      data: {
        body,
        post: { connect: { id: Number(postId) } },
        owner: { connect: { id: userId } },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Create comment error:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Comment couldn't be created." });
  }
};

exports.createPost = async (req, res) => {
  const { title, description, body, image, state } = req.body;
  const userId = req.user.id;

  try {

    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const post = await prisma.post.create({
      data: {
        title,
        description,
        body,
        image,
        state: state || "draft",
        owner: { connect: { id: userId } },
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, description, body, image, state } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.ownerId !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: { title, description, body, image, state },
    });

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.ownerId !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
