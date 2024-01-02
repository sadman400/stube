const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, "./public/temp")
    },
    filename: function(req, file, cd) {
        cd(null, file.originalname)
    }
})

const upload = multer({storage})

module.exports = upload;