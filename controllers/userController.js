const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.promoteToAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
    res.status(200).json({
      message: `User promoted to admin successfully.`,
      user: {
        id: updatedUser.id,
        fullname: updatedUser.fullname,
        role: updatedUser.role,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({ error: "Internal server error" , details: error.details});
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, fullname: true, email: true }
    });

    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllReaders = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }
    const readers = await prisma.user.findMany({
      where: { role: "READER" },
      select: { id: true, fullname: true, email: true }
    });

    res.status(200).json({ readers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error in here"});
  }
};
