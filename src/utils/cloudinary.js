const { v2: cloudinary } = require("cloudinary")
const fs = require("fs")
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  
  const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        // console.log("File is uploaded on Cloudinary", response.url);

        // Remove the locally saved temporary file
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error('Error while deleting file:', err);
            }
        });

        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error('Error while deleting file:', err);
            }
        });

        return null;
    }
};
  

module.exports = uploadOnCloudinary;