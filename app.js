const express = require("express");
const path = require("node:path");
require("dotenv").config();

const authRouter = require("./routes/authRouter")
const postsRouter = require("./routes/commentRouter")
const commentRouter = require("./routes/commentRouter")

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", authRouter)
app.use("/posts", postsRouter)
app.use("/comments", commentRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`app is runing at ${port}`)
})