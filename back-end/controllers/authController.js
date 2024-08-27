const asyncHandler = require("express-async-handler")
const userQuery = require("../models/userQuery");
const jwt =require("jsonwebtoken")
const bcrypt = require("bcryptjs")



exports.postLogIn = asyncHandler(async(req,res, next) => {
    const { email, password } = req.body
    if(!email && !password){
        return res.status(400).json({
            message: " email or password can't be empty"
        })
    }

    const result = await userQuery.getUserByEmail(email);
    if(result.success === true){
        const match = await bcrypt.compare(password, result.data.password)
        if(match) {
            const user = result.data
            const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: "1800s" })
            return res.status(200).json({
                message:"User Authentication Successful",
                token 
            })
        }else {
            return res.status(402).json({
                message: "incorrect credential"
            })
        }
    }
    return res.status(404).json({
        message: result.message,
        error: result.error
    })
})



// function for getting user details for testing

exports.getUser = asyncHandler(async(req, res, next) => {
    const { id } = req.params
    if(isNaN(id)){
        return res.status(400).json({
            message: "incorrect value sent as parameter"
        })
    }
    const user = await userQuery.getUserById(id)
    if(user.success === true){
        res.json({
            user:user.data
        })
    }else{
        res.json({
            message: "no user found"
        })
    }
} )


exports.postAuthenticate = (req,res) => {
    res.json({
        message: "token approved, User Authorized",
        user: req.user
    })
}