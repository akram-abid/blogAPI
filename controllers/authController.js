const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.authenticateUser = async (req, res) => {
  const { fullname, email, password } = req.validatedData;
  console.log("we are trying to fing this email ", email);
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) return res.status(401).json("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json("Wrong password");

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
  console.log("authenticating and trying to verify token...");
  
  const authHeader = req.headers["authorization"];
  console.log("this is the whole authorization headers ", authHeader);
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Forbidden in the auth",
        details: err.message 
      });
    }

    console.log("JWT verification successful, decoded user:", user);
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
