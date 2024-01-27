import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body;
    // check all the fields are present
    if (!username || !email || !password || !fullName) {
        throw new ApiError("All fields are required", 400);
    }
    // if @ is not present
    if (!email.inclues("@")) {
        throw new ApiError("Invalid email", 400);
    }

    // check if user already exists
    const existsUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (existsUser) {
        throw new ApiError("User already exists", 400);
    }

    const avatarLocalFile = req.files?.avatar[0]?.path;
    const coverImageLocalFile = req.files?.coverImage[0]?.path;
    if (!avatarLocalFile) {
        throw new ApiError("Avatar is required", 400);
    }


    const avatar = await uploadOnCloudinary(avatarLocalFile);
    const coverImage = await uploadOnCloudinary(coverImageLocalFile);

    if (!avatar) {
        throw new ApiError("Avatar upload faild", 400);
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError("User not created", 500);
    }

    return res.status(201).json(new ApiResponse(200, "User created successfully", createdUser));
    
})


export{
    registerUser
};