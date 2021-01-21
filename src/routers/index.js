const routers = require('express').Router()
const authRouter = require('./auth')
const typebookRouter = require('./typebook.router')
const upload = require('./upload')

routers.use('/auth', authRouter)
routers.use('/typebook', typebookRouter)
routers.use('/upload', upload)

module.exports = routers