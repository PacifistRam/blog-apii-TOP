const asyncHandler = require("express-async-handler")
const { body, validationResult, param} = require("express-validator")
const blogQuery = require("../models/blogQuery")

const validateCreatePost = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isString()
    .withMessage("Title must be a string"),
  body("content")
    .optional()
    .trim()
    .isString().withMessage("Content must be a string"),
];

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const { sortBy, orderBy, limit } = req.query;
  // validate query fields
  const validateSortFields = ["createdAt", "updatedAt", "title", "id"];
  const sortField = validateSortFields.includes(sortBy) ? sortBy : "id";
  const sortDirection = orderBy === "desc" ? "desc" : "asc";
  let limitPost = parseInt(limit, 10);
  if(isNaN(limitPost) || limitPost <=0){
    limitPost = 10;
  }
  const result = await blogQuery.getAllPosts(sortField, sortDirection, limitPost);
  if (result.success === true) {
    res.status(200).json({
      allBlogs: result.data,
    });
  } else {
    res.status(404).json({
      message: result.message,
    });
  }
});

exports.getSinglePost = [
  param("postId")
  .isInt({gt: 0}).withMessage("Invalid postId "),

  asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({
          message: errors.array()[0].msg
        })
      }
      const { postId } = req.params
        const result = await blogQuery.getSinglePost(postId)
          if(result.success === true){
            return res.status(200).json({
                post: result.data
            })
      }
      return res.status(400).json({
          message: result.message
      })
  })

] 

exports.postCreatePost = [
  validateCreatePost,
  asyncHandler(async (req, res, next) => {
    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        errors: errors.array(),
      });
    } else {
      const { title, content } = req.body;
      const authorId = req.user.id
      const result = await blogQuery.createPost(title, content, authorId);
      if (result.success === true) {
        return res.status(200).json({
          message: result.message,
        });
      }
      return res.status(400).json({
        message: result.message,
      });
    }
  }),
]; 

exports.putPostUpdate = [
  param("postId")
  .isInt({gt: 0}).withMessage("Invalid postId"),
  body('title')
  .notEmpty().withMessage('Title is required')
  .isString().withMessage('Title must be a string')
  .isLength({min: 5, max: 30}).withMessage("Title should be of length 5 to 30 characters")
  .escape(),
  body('content')
  .optional()
  .isString().withMessage('content must be of type string'),
  body('published')
  .notEmpty().withMessage("published cannot be empty")
  .isBoolean().withMessage('value can be only true or false'),
  
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const errorMessageArray = errors.array().map(error => error.msg)
      return res.json({
        errors: errorMessageArray
      })
    }else{
      const { postId } = req.params
      const postExists = await blogQuery.getSinglePost(postId);
      if(!postExists.success){
        return res.status(400).json({
          message: "Post not found"
        })
      }else if(postExists.data.authorId !== req.user.id){
        return res.status(400).json({
          message: "only author can update his own post"
        })
      }
      const {title, content, published } = req.body
      
      const result = await blogQuery.updatePost(postId, title, content, published, );
      if(result.success === true){
        return res.status(200).json({
          message: " post updated successfully",
          updatedPost: result.data
        })
      }
      return res.status(400).json({
        message: " post not updated",
        error: result.error
      })
      
    }
  })

] 
  


exports.deletePostById = [
  param("postId")
  .isInt({gt: 0}).withMessage("invalid parameter"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        message:errors.array()[0].msg
      })
    }
    const { postId } = req.params
    const {id: userId, role: userRole } = req.user;

    const postExists = await blogQuery.getSinglePost(postId);
    if(!postExists.success){
      return res.status(404).json({
        message: "post doesn't exist"
      })
    }
    const post = postExists.data
    
    if(post.authorId !== userId && userRole !== "admin" ){
      return res.status(403).json({
        message: "only author or admin can delete his own post"
      })
    }
   
   const result = await blogQuery.deletePost(postId)
   if(result.success === true) {
     return res.status(200).json({
       message: "Post deleted",
       post: result.data
     })
   }

   return res.status(500).json({
    message: "Failed to delete post",
    error: result.error.message
   })
 })
]