const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.authenticateUser = async (req, res) => {
  const { fullname, email, password } = req.validatedData;

  const user = await prisma.user.findUnique({
    whrer: { email },
  });
  if (!user) return res.status(401).json("Invalid credentials");

  const match = bcrypt.compare(password, user.password);
  if (match) return res.status(401).json("Wrong password");

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ token });
};

exports.createNewUser = async (req, res) => {
  const { fullname, email, password } = req.validatedData;

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

exports.authenticateToken = (req, res, next) => {
  console.log("authenticating and trying to verify token...")
  const token = req.headers["Authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });

    req.user = user;
    next();
  });
};

/*
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}
*/ 