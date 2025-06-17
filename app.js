const express = require("express");
const path = require("node:path");
require("dotenv").config();

const authRouter = require("./routes/authRouter")
const postsRouter = require("./routes/postsRouter")
const commentRouter = require("./routes/commentRouter")
const usersRouter = require("./routes/usersRouter")

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRouter)
app.use("/api/posts", postsRouter)
app.use("/api/comments", commentRouter)
app.use("/api/users", usersRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`app is runing at ${port}`)
})