import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(error.message || "Something went wrong", 500);
  }
};

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
    $or: [{ username }, { email }],
  });
  if (existsUser) {
    throw new ApiError("User already exists", 400);
  }

  const avatarLocalFile = req.files?.avatar[0]?.path;
  let coverImageLocalFile;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalFile = req.files.coverImage[0].path;
  }

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
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError("User not created", 500);
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

// login user part
const loginUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!(email || username)) {
    throw new ApiError("All fields are required", 400);
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isPasswordValid = await user.isPasswordCurrect(password);
  if (!isPasswordValid) {
    throw new ApiError("Invalid password", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// logout user part
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", null));
});

export { registerUser, loginUser, logoutUser };
