const asyncHandler = require("../utils/asyncHandler.js");

const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
} )


module.exports = registerUser;