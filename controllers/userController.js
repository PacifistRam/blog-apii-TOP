const asyncHandler = require("express-async-handler")
const userQuery = require("../models/userQuery");
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

exports.getAuthor = asyncHandler(async (req, res, next) => {
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

exports.postCreateAuthor = asyncHandler(async(req, res, next) => {
    const{ name, email, password } = req.body

    const result = await userQuery.createAuthor(name, email, password);
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