import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        
        const connectIstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connection successfully: ${connectIstance.connection.host}`);

    } catch (error) {
        console.log("mongodb connection faild", error);
        process.exit(1);
    }
}

export default connectDB;