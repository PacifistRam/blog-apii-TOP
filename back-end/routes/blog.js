const { Router } = require("express")

const blogRouter = Router()
const blogController = require("../controllers/blogController");
// middleware for auth
const { authenticateToken } = require("../middleware/jwtAuth")

// get all posts
blogRouter.get("/posts", blogController.getAllPosts);

// get single post by id
blogRouter.get("/post/:postId", blogController.getSinglePost)

// create new blog

// post route
blogRouter.post("/post/create", authenticateToken, blogController.postCreatePost)

// put request for updating post
blogRouter.put("/post/update/:postId",authenticateToken,  blogController.putPostUpdate)


// delete post 
blogRouter.delete("/post/delete/:postId", authenticateToken, blogController.deletePostById)



module.exports = blogRouter