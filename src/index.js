import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});


connectDB() // for mongodb conneciton from database...
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running...... ${process.env.PORT}`); // for running server...
    })
})
.catch((err) => console.log("Mongodb connection faild", err)); // server faild...