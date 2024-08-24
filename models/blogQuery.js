const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

async function getAllPosts(sortField, sortOrder, limit) {
    try {
        const posts = await prisma.post.findMany({
            take:limit,
            include:{
                author:{
                    select:{
                        id: true,
                        name:true
                    }
                }
            },orderBy:{
                [sortField] : sortOrder
            }
        })
        if(posts.length > 0) {
            return{
                success:true,
                data:posts
            }
        }
        else{
            return{
                success:false,
                message:"No Posts found"
            }
        }
    } catch (error) {
        console.error("Database Error:", error.message);
        return{
            success: false,
            message:"Database Error",
            error: error.message
        }
    }
}

async function getSinglePost(id) {
    try {
        const post = await prisma.post.findUnique({
            where:{
                id: +id
            },
            include:{
                author:{
                    select:{
                        id:true,
                        name:true,

                    }
                }
            }
        })
        if(post) {
            return{
                success: true,
                data:post
            }
        }else{
            return{
                success:false,
                message:"No post found"
            }
        }
    } catch (error) {
        console.error("Database Error:",  error);
        return{
            success: false,
            message: "database  error",
            error: error.message
        }
    }
}

async function createPost(title, content, authorId) {
    try {
        const result = await prisma.post.create({
            data:{
                title:title,
                content: content,
                authorId: authorId
            }
        })
        if(result) {
            return{
                success: true,
                message: result
            }
        }else{
            return{
                success: false,
                message: "Failed in creating post"
            }
        }
    } catch (error) {
        console.error("database Error: ", Error)
        return{
            success:false,
            message: "Database Error"
        }
    }
    
}

async function updatePost(id, title, content, published) {
   try {
    const updatePost = await prisma.post.update({
        where: {
            id: +id
        },
        data: {
            title: title,
            content: content,
            published: published,
        }
    })
    if(updatePost) {
         return{
            success: true,
            data: updatePost
         }      
    }else {
        return{
            success: false,
            message: "No post found"
        }
    }
        
   } catch (error) {
    console.error("Database Error: ", error.message);
    return{
        success: false,
        message: "Database error encountered",
        error: error.message
    }
   }
}

async function deletePost(id) {
    try {
        const deletedPost = await prisma.post.delete({
            where: {
                id: +id
            }
        })
        if(deletePost) {
            return{
                success: true,
                data: deletedPost
            }
        }else {
            return{
                success: false,
                message: "no posts to delete we found"
            }
        }
    } catch (error) {
        console.error("Database error: ", error);
        return{
            success: false,
            message: "Database Error while deleting post",
            error: error.message
        }
    }
}



module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
}