const routers = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const  {cloudinaryConfig} = require('../config/config')

cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret
})

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        return cb(null, '/tmp/')
    }
})
const fileFilterImages = (req, file, cb) =>{
    //only upload files jpg or png
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png')
    {return cb(null, true)}
    else{return cb(null, false)}
}
const upload = multer({storage: storage, limits: {fileSize:1024*1024*10}, fileFilter:fileFilterImages})
routers.post('/images',upload.array('images', 10) , async (req, res, next) => {
    let images = [];
    for(const image of req.files){
        const imageUrls = await cloudinary.uploader.upload(image.path, {folder: 'images'}, (err, result)=>{
            if(err) throw new Error(err)
            return result
        })
        images.push(imageUrls.url)
        fs.unlinkSync(image.path)
    }
    return res.status(200).json({images: images})
})




module.exports = routers