const mongoose = require("mongoose")

const {MONGO_URI} = process.env;

exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("database connected!")
        })
        .catch((error) => {
            console.log("error in database connection")
            console.error(error)
            process.exit(1);
        })
};