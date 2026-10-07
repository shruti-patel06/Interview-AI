const multer = require("multer")

const MAX_RESUME_SIZE_MB = 3

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:MAX_RESUME_SIZE_MB * 1024 * 1024 //3MB
    },
    // pdf-parse can only read PDFs, so reject everything else up front
    fileFilter:(req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            const err = new Error("Only PDF resumes are supported")
            err.status = 400
            return cb(err)
        }
        cb(null, true)
    }
})

module.exports = upload
module.exports.MAX_RESUME_SIZE_MB = MAX_RESUME_SIZE_MB
