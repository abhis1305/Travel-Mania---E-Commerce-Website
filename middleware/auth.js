const jwt = require("jsonwebtoken")
const LogInCollection = require("../models/signupSchema")

// TO CHECKING USER IS LOGIN OR NOT
const auth = async (req,res,next) => {
    try{
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, process.env.KEY)
        const user = await LogInCollection.findOne({_id: verifyUser._id})
        console.log(user.email);
        req.token = token
        req.user = user
        next()
    }
    catch (error){
        res.render("signin")
    }
}

module.exports = auth