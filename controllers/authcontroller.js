const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.authenticateUser = (req, res) => {
  res.send("trying to authenticate here...");
};

exports.createNewUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      error: "Email already used.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  console.log("this is the token ", token);

  res.json({ token });
};
