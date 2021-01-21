const routers = require('express').Router()
const AuthService = require('../services/users')
const joi = require("@hapi/joi");
const createError = require('http-errors')
const passport = require('passport')


routers.post('/login',  async(req, res, next) =>{
    try {
        const bodySchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        })
        const userData =  await bodySchema.validateAsync(req.body)
        console.log(userData)
       const user = await AuthService.login(userData.email, userData.password)
           return res.status(200).json({user: user.userInfo, token: user.token})
    } catch (error) {
        next(createError(400, error.message))
    }
    

})
routers.post('/register',  async (req, res, next)=> {
    try {
        const bodySchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
            displayName: joi.string().required(),
            role: joi.string().required(),
            photoUrl: joi.string()
        }).unknown()
        const userData = await bodySchema.validateAsync(req.body)
       const user = await AuthService.findUserByEmail(userData.email)
       if(user != null){
           return res.status(400).json({message: "Email is exist"})
       }
       await AuthService.register(userData.email, userData.password, userData.displayName, userData.role, userData.photoUrl, userData.gender)
       return res.status(200).json({ message: "Registration successfully"})
    } catch (error) {
        next(createError(400, "Registration failed "))
    }
})

routers.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

routers.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    const token = AuthService.encodedToken(req.user.role, req.user.email, req.user._id)
    return res.status(200).json({user: req.user, token: token})
})

routers.get("/me/:id", async (req, res) => {
    const me = await AuthService.getMe(req.params.id)
    return res.status(200).json({user: me})
})
routers.get('/facebook', passport.authenticate("facebook"))
routers.get('/facebook/redirect', passport.authenticate("facebook"), (req, res) =>{
    const token = AuthService.encodedToken(req.user.role, req.user.email, req.user._id)
    return res.status(200).json({user: req.user, token: token})
})




module.exports = routers