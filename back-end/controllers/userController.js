const asyncHandler = require("express-async-handler")
const userQuery = require("../models/userQuery");
const bcrypt = require("bcryptjs")
const { body, param, validationResult} = require("express-validator")
exports.getAllAuthors = asyncHandler(async (req, res, next) => {
    const { sortBy, sortOrder} = req.query;

    // validate query fields
    const validateSortFields = ['name', 'id'];
    const sortField = validateSortFields.includes(sortBy) ? sortBy: 'id';
    const sortDirection = sortOrder === 'desc' ? 'desc' : 'asc' 
    const result  = await userQuery.getAllAuthors(sortField, sortDirection)
    if(result.success === true){
        res.json({
            Authors:result.data
        })
    }else{
        res.json({
            message: result.message
        })
    }
    
})

exports.getAuthor = [
    param("id")
    .isInt().withMessage("Invalid parameter"),

    asyncHandler(async (req, res, next) => {
        // handle validation errors
        const errors =validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg
            })
        }
        
        const { id } = req.params
        const result = await userQuery.getAuthorById(id)
        console.log(result)
        if(result.success === true){
            const { id, name, email, posts} = result.data
            res.json({
                AuthorId:id,
                Author:name,
                email,
                posts
            })
        }else{
            res.json({
                message: result.message
            })
        }
        
    })
]

exports.postCreateAuthor = [
    body("name")
    .trim()
    .notEmpty().withMessage("name cannot be empty")
    .matches(/^[A-Za-z\s]+$/).withMessage('Name cannot contain numbers or special characters')
    .escape(),

    body("email")
    .trim()
    .notEmpty().withMessage("email cannot be empty")
    .normalizeEmail()
    .isEmail().withMessage("invalid email format"),

    body("password")
    .notEmpty().withMessage("password cannot be empty"),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const ErrorMsgArray = errors.array().map(error => error.msg)
            return res.status(400).json({
                message:ErrorMsgArray
            })
        }
        const{ name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
    
        const result = await userQuery.createAuthor(name, email, hashedPassword);
        if(result.success === true){
            return res.status(200).json({
                message: "new Author created",
                data: result.data
            })
        }
        return res.status(400).json({
            message: result.message,
            error: result.error
    
        })
    
    })
] 

// delete author and all its post

exports.deleteAuthor = asyncHandler(async(req, res, next) => {
    const { id } = req.params
    const result = await userQuery.deleteAuthorAndPosts(id);
    if(result.success === true) {
        return res.status(200).json({
            message: "Author deleted with their posts",
            data: result.data
        })
    } 
    return res.status(400).json({
        message: result.message,
        error: result.error
    }) 
})


// create new admin
exports.createNewAdmin = [
    body("name")
    .trim()
    .notEmpty().withMessage("name cannot be empty")
    .matches(/^[A-Za-z\s]+$/).withMessage('Name cannot contain numbers or special characters')
    .escape(),

    body("email")
    .trim()
    .notEmpty().withMessage("email cannot be empty")
    .normalizeEmail()
    .isEmail().withMessage("invalid email format"),

    body("password")
    .notEmpty().withMessage("password cannot be empty"),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            const ErrorMsgArray = errors.array().map(error => error.msg)
            return res.status(400).json({
                message:ErrorMsgArray
            })
        }
        const{ name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
    
        const result = await userQuery.createAdmin(name, email, hashedPassword);
        if(result.success === true){
            return res.status(200).json({
                message: "new Admin created",
                data: result.data
            })
        }
        return res.status(400).json({
            message: result.message,
            error: result.error
    
        })
    
    })
]


// createAdmin