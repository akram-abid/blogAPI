const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body; // Changed from 'body' to 'text'
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.commentorID !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { text },
      include: {
        commentor: { select: { fullname: true, id: true } }
      }
    });

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error in comments" });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.ownerId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.log("i got here by my own")
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" , details: error.details});
  }
};

