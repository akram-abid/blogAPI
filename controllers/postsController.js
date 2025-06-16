const PrismaClient = require("@prisma/client");
const prisma = PrismaClient();

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
    const { postId } = req.params

    try {
        const post = await prisma.posts.findUnique({
            where:{ id: postId },
            include: {
                owner: {select: {fullname: true}  },
                comments: true
            }
        })

        if(!post) return res.status(404).json({error: "Post not found"})

        res.json({post})
    } catch (error) {
        res.status(500).json({error: "internal server error"})
    }
}

exports.createNewComment = async (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;
  const userId = req.user.id;

  try {
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
    res.status(500).json({ error: "Internal server error. Comment couldn't be created." });
  }
};
