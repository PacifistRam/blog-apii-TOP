const express = require("express")
require('dotenv').config()
const app = express()
const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")



app.use(express.json())
// app.use(express.urlencoded({extended: true}))



app.get("/", (req, res) =>res.json({title: "Home"}));

app.use("/user", userRouter)
app.use("/blog", blogRouter)


const PORT = process.env.PORT  || 5000 


app.listen(PORT, () => {`Server started on Port: ${PORT}`})