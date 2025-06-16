exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { body } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.ownerId !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { body },
    });

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.ownerId !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

