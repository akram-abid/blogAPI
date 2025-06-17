const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await prisma.post.findMany({
      where: { state: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        author: { select: { fullname: true, id: true } },
        comments: true,
      },
    });
    
    const totalPosts = await prisma.post.count({
      where: { state: "PUBLISHED" }, // Fixed: should be "PUBLISHED" not "published"
    });
    
    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
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
        author: { select: { fullname: true } },
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
  const userId = req.user.userId; 

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId }, 
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await prisma.comment.create({
      data: {
        text: body, 
        postId: postId, 
        commentorID: userId, 
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ 
      error: "Internal server error. Comment couldn't be created.",
      details: error.message 
    });
  }
};

exports.createPost = async (req, res) => {

  const { title, description, body, image, state } = req.body;
  const userId = req.user.userId; 


  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden you are not an admin" });
    }

    console.log("About to create post with data:", {
      title,
      intro: description,
      body,
      image,
      state: state?.toUpperCase() || "DRAFT",
      authorId: userId,
    });

    const post = await prisma.post.create({
      data: {
        title,
        intro: description,
        body,
        image,
        state: state?.toUpperCase() || "DRAFT",
        authorId: userId,
      },
    });

    console.log("Post created successfully:", post);
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, description, body, image, state } = req.body;
  const userId = req.user.userId;
  const userRole = req.user.role;

  console.log("=== UPDATE POST DEBUG ===");
  console.log("Full req.user object:", req.user);
  console.log("Extracted userId:", userId);
  console.log("User role:", userRole);
  console.log("PostId from params:", postId);

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    console.log("Found post:", post);
    
    if (!post) return res.status(404).json({ error: "Post not found" });

    console.log("Permission check:");
    console.log("- Post authorId:", post.authorId);
    console.log("- Current userId:", userId);
    console.log("- User role:", userRole);
    console.log("- authorId === userId?", post.authorId === userId);
    console.log("- userRole === 'ADMIN'?", userRole === "ADMIN");

    if (post.authorId !== userId && userRole !== "ADMIN") {
      console.log("❌ PERMISSION DENIED");
      return res.status(403).json({ error: "Forbidden in here" });
    }

    console.log("✅ PERMISSION GRANTED");

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.intro = description;
    if (body !== undefined) updateData.body = body;
    if (image !== undefined) updateData.image = image;
    if (state !== undefined) updateData.state = state?.toUpperCase();

    console.log("Update data:", updateData);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostComments = async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log("postId received:", postId);

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        commentor: { select: { fullname: true, id: true } }, // Changed from 'owner' to 'commentor'
      },
    });

    const totalComments = await prisma.comment.count({
      where: { postId },
    });

    res.status(200).json({
      comments,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error in comments" });
  }
};

exports.getUnpublishedPosts = async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      where: { state: "draft" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        owner: { select: { fullname: true, id: true } },
        comments: true,
      },
    });

    const totalPosts = await prisma.post.count({
      where: { state: "draft" },
    });

    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching unpublished posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
