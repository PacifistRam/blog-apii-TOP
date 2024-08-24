const asyncHandler = require("express-async-handler")
const { body, validationResult} = require("express-validator")
const blogQuery = require("../models/blogQuery")

const validateCreatePost = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('content')
        .isString().withMessage('Content must be a string'),
    body('authorId')
        .notEmpty().withMessage('Author ID is required')
        .isInt().withMessage('Author ID must be an integer')
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

exports.getSinglePost = asyncHandler(async (req, res, next) => {
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
      const { title, content, authorId } = req.body;
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
  body('title')
  .notEmpty().withMessage('Title is required')
  .isString().withMessage('Title must be a string'),
  body('content')
  .isString().withMessage('content must be of type string'),
  body('published')
  .notEmpty().withMessage("published cannot be empty")
  .isBoolean().withMessage('value can be only true or false'),
  
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.json({
        errors: errors.array()
      })
    }else{
      const { postId } = req.params
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
  


exports.deletePostById = asyncHandler(async(req, res, next) => {
  const { postId } = req.params
  const result = await blogQuery.deletePost(postId)
  if(result.success === true) {
    return res.status(200).json({
      message: "Post deleted",
      post: result.data
    })
  }
})