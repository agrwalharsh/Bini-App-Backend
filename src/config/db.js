const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URL,
            {
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
                // useFindAndModify: false
            }
        )
        console.log('Connection Successful')
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = connectDB