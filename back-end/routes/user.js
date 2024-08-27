const { Router } = require("express")

const userRouter = Router()
const userController = require("../controllers/userController")

const authController = require("../controllers/authController")
const { authenticateToken } = require("../middleware/jwtAuth")


userRouter.get("/authors",userController.getAllAuthors )
userRouter.get("/author/:id",userController.getAuthor )

// create new author
userRouter.post("/author/create",userController.postCreateAuthor )

// delete author with their pots
userRouter.delete("/author/delete-with-post/:id", userController.deleteAuthor)

// create admin route
userRouter.post("/admin/create",userController.createNewAdmin)


// test login route
userRouter.get("/Check/:id", authController.getUser)
userRouter.post("/login", authController.postLogIn)

// test authentication with sent token
userRouter.get("/verify-user", authenticateToken, authController.postAuthenticate )



module.exports = userRouter;