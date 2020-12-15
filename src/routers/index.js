const routers = require('express').Router()
const authRouter = require('./auth')
const typebookRouter = require('./typebook.router')

routers.use('/auth', authRouter)
routers.use('/typebook', typebookRouter)

module.exports = routers