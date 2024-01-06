// const mongoose = require("mongoose");
// const DB_NAME = require("../constants.js")
// MONGODB_URL

// const connectDB = async () => {
//     try {
//         const connectInstance = await mongoose.connect(`${process.env.MONGODB_URL},${DB_NAME}`);
//         console.log(`\n MongoDB connected! DB HOST: ${connectInstance.connection.host}`);
//     } catch (error) {
//         console.log("MONGODB connection error", error);
//         process.exit(1);
//     }
// };

const mongoose = require("mongoose");
const DB_NAME = require("../constants.js");

const connectDB = async () => {
    try {
        
        const connectInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n Mongodb connected! db host: ${connectInstance.connection.host}`);

    } catch (error) {
        console.log("mongodb connection error", error);
        process.exit();
    }
}

module.exports = connectDB;
