const routers = require('express').Router()
const createError = require('http-errors')
const join = require('joi')
const { getPublishers, getDetailsPublisher, createPublisher, updatePublisher, findPublisherByName, deletePublisher } = require('../services/admin/admin.services.publishers')

routers.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const searchKey = req.query.searchKey || ''
        const result = await getPublishers(page, limit, searchKey)
        return res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
})

routers.post('/createdPublisher', async (req, res, next) => {
    try {
        const publisherData = join.object({
            publisherName: join.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required(),
            address: join.string().pattern(new RegExp('/^(\d{1,3})\s?(\w{0,5})\s([a-zA-Z]{2,30})\s([a-zA-Z]{2,15})\.?\s?(\w{0,5})$/')).required()
        })
        const newData = publisherData.validate(req.body)
        if (newData.error) {
            return res.status(400).json({ message: newData.error.message })
        }
        const publisher = await findPublisherByName(req.body.publisherName)
        if (publisher) {
            return res.status(400).json({ message: "Publisher is exist" })
        }
        await createPublisher(newData)
        return res.status(200).json({ message: "Create publisher successfully" })
    } catch (error) {
        next(error)
    }
})
routers.delete('/:publisherId', async (req, res, next) => {
    try {
        await deletePublisher(req.params.publisherId)
        return res.status(200).json({ message: "Delete Publisher successfully" })
    } catch (error) {
        next(error)
    }
})

routers.put('/:publisherId', async (req, res, next) => {
    try {
        const publisherData = join.object({
            publisherName: join.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required(),
            address: join.string().pattern(new RegExp('/^(\d{1,3})\s?(\w{0,5})\s([a-zA-Z]{2,30})\s([a-zA-Z]{2,15})\.?\s?(\w{0,5})$/')).required()
        })
        const newData = publisherData.validate(req.body)
        if (newData.error) {
            return next(createError(400, newData.error.message))
        }
        await updatePublisher(req.params.publisherId, newData)
        return res.status(200).json({ message: "Update Publisher successfully" })
    } catch (error) {
        next(error)
    }

})

routers.get('/:publisherId', async (req, res, next) => {
    try {
        const publisher = await getDetailsPublisher(req.params.publisherId)
        return res.status(200).json({ data: publisher })
    } catch (error) {

    }
})

module.exports = routers