const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const ApiResponse = require("../utils/ApiResponse.js");

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

        if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = User.findOne({
            $or: [{username}, {email}]
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists")
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required")
        }
        
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong when registering the user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
} )


module.exports = registerUser;