const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");

const registerUser = asyncHandler( async (req, res) => {

    // get user details form frontend === completed *********
    // then the validation - it not should be empty === completed ******
    // check if user already exists: in that case username and email should be unique
    // check for images, chekc for avatar
    // upload them to cloudinary, avatar 
    // create user object - in this part we need to create entry in database (mongodb)
    // remove password and refresh token field from response
    // check for user creation 
    // return response

        const {fullname, username, email, password} = req.body; // we are geting details from the fronted

        


} )


module.exports = registerUser;