const routers = require('express').Router()
const createError = require('http-errors')
const join = require('joi')
const mongoose = require('mongoose')
const { createTypeBook, typesBook, getTypeBookDetail, getBookTypebook, updateTypeBook, deleteTypeBook } = require('../services/admin/admin.services.typebook')


routers.post('/createtypebook', async (req, res, next) => {
    try {
        const typeBookData = join.object({
            type_name: join.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required()
        })
        const newData = await typeBookData.validate(req.body)
        if (newData.error) {
            newData.error.message = "Invalid type name"
            return next(createError(400, newData.error.message))
        }
        await createTypeBook(newData.value)
        return res.status(200).json({ message: 'Create type book successfully' })
    } catch (error) {
        next(createError(400, error.message))
    }
})
routers.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit)||5
        const result = await typesBook(page, limit)
        return res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
})
routers.get('/:typebookId', async (req, res, next) => {
    try {
            const typebook = await getTypeBookDetail(req.params.typebookId)
            return res.status(200).json({ data: typebook })
    } catch (error) {
        next(error)
    }
})
routers.get('/books/:typebookId', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
            const typebook = await getBookTypebook(req.params.typebookId, page)
            return res.status(200).json({ data: typebook })

    } catch (error) {
        next(error)
    }
})
routers.put('/:typebookId', async (req, res, next) => {
    try {
        const typebook = join.object({
            type_name: join.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required()
        })
        const typebookValidate = await typebook.validate(req.body)
        if (typebookValidate.error) {
            typebookValidate.error.message = "Invalid type name"
            return next(createError(400, typebookValidate.error.message))
        }
        await updateTypeBook(req.params.typebookId, typebookValidate.value)
        return res.status(200).json({ message: "Update successfully" })
    } catch (error) {
        next(error)
    }
})
routers.delete('/:typebookId', async (req, res, next) => {
    try {
        await deleteTypeBook(req.params.typebookId)
        return res.status(200).json({ message: "Delete type book successfully"})
    } catch (error) {
        next(error)
    }
})




module.exports = routers