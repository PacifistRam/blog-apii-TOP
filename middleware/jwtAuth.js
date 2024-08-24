const jwt = require("jsonwebtoken");
require('dotenv').config()

// const token = jwt.sign({email}, process.env.JWT_SECRET,{ expiresIn: "1800s"})

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers["authorization"]

    // extracting token from authorization header
    const token = authHeader&&authHeader.split(" ")[1];

    // checking if the token is null
    if(!token){
        return res.status(401).json({message: "Authorization failed. No access token."})
    } 

    // verifying if the token is null
    jwt.verify(token,process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).json({message: "Could not verify token"})
        }
        req.user = user
        console.log(user)
        next();
    })
}


module.exports = { authenticateToken }