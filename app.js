const express = require("express");
const path = require("node:path");
require("dotenv").config();


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT ? process.env.PORT : 4000

app.listen(port, () => {
    console.log(`app is runing at ${port}`)
})