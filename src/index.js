const connectDB = require("./db/index.js");
const app = require("./app.js");
require('dotenv').config({ path: './.env' });


connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at ${process.env.PORT}`);
    })
} )
.catch((err) => {
    console.log("MONGO db connection faild !!!", err);
})
