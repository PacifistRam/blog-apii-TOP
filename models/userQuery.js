const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

// get all Users
async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return {
      success: users.length > 0,
      data: users.length > 0 ? users : undefined,
      message: users.length > 0 ? undefined : "No users Found",
    };
  } catch (error) {
    console.error("Database Error", error);
    return {
      success: false,
      message: "Database error encountered",
      error: error.message,
    };
  }
}

// get user by email for auth
async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if(user){
      return{
        success: true,
        data: user
      }
    }
    return{
      success: false,
      message: "User not found"
    }
  } catch (error) {
    console.error("database error: ", error )
    return{
      success: false,
      message: "database error in getting user",
      error: error.message
    }
  }
}


// get user by Id
async function getUserById(id) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    return {
      success: result !== null,
      data: result || undefined,
      message: result ? undefined : "User not found",
    };
  } catch (error) {
    console.error("Database error: ", error);
    return {
      success: false,
      message: "An error occurred while fetching the user ",
      error: error.message,
    };
  }
}

// get all authors 
async function getAllAuthors(sortField, sortOrder) {
    try {
        const authors = await prisma.user.findMany({
            where:{
                role: Role.author //using enum value directly
            },
            select: {
                id:true,
                name:true,
                email:true,
                posts:{
                    select:{
                        id:true,
                        title:true,
                        createdAt:true,
                    }
                }
            }, orderBy:{
              [sortField]: sortOrder
            }
           
        })
        return{
            success: authors.length > 0,
            data: authors.length > 0 ? authors : undefined,
            message: authors.length > 0 ? undefined : "No authors Found",
        }
    } catch (error) {
        console.error("Database Error: ", error)
        return{
            success:false,
            message: "An error occurred while fetching the user ",
            error: error.message,
        }
    }
   
}

// get single author
async function getAuthorById(authorId) {
    try {
        const author = await prisma.user.findUnique({
            where:{
                id: +authorId
            },
            include:{
                posts:{
                  select:{
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt:true,
                  }
                },
            }
        })
        return{
            success: author !== null,
            data: author || undefined,
            message: author ? undefined : "Author not found",
        }
    } catch (error) {
        console.error("Database Error: ", error)
        return{
            success:false,
            message: "An error occurred while fetching the author ",
            error: error.message,
        }
    }
}

// create new author
async function createAuthor (name, email, password) {
  try {
    const newAuthor = await prisma.user.create({
      data:{
        name: name,
        email: email,
        password: password,
        role: Role.author
      }
    })
    if(newAuthor) {
      return{
        success: true,
        data: newAuthor
      }
    }else {
      return{
        success: false,
        message: " Error in creating new user"
      }
    }
  } catch (error) {
    console.error("Database error: ", error.message)
    return{
      success: false,
      message: "database error while creating new author",
      error: error.message
    }
  }
}

// delete author and all his posts
async function deleteAuthorAndPosts(id) {
  try {
    const deletePosts = prisma.post.deleteMany({
      where: {
        authorId: +id
      }
    })
    
    const deleteAuthor = prisma.user.delete({
      where:{
        id: +id
      }
    })

    const transaction = await prisma.$transaction([deletePosts, deleteAuthor])
    if(transaction) {
      return{
        success: true,
        data: transaction
      }
    }else {
      return{
        success: false,
        message: "no author found"
      }
    }
  } catch (error) {
    console.error("Database error: ", error)
    return{
      success: false,
      message: " database error while deleting record",
      error: error.message
    }
  }
}




// update name of user
async function updateUser(id,  name) {
  try {
   const updateUser = await prisma.user.update({
       where: {
           id: +id
       },
       data: {
           name: name,
       }
   })
   if(updateUser) {
        return{
           success: true,
           data: updateUser
        }      
   }else {
       return{
           success: false,
           message: "No User found"
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





module.exports = {
    getUserById,
    getUserByEmail,
    getAuthorById,
    getAllAuthors,
    getAllUsers,
    createAuthor,
    updateUser,
    deleteAuthorAndPosts
}