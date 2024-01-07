const express = require("express");
const registerUser = require("../controllers/user.controller.js");
const loginUser = require('../controllers/user.controller.js');
const logoutUser = require("../controllers/user.controller.js");
const verifyJWT = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/multer.middleware.js')

const router = express.Router()


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route('/logout').post(verifyJWT, logoutUser)

module.exports = router;

