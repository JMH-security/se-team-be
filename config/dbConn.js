const mongoose = require('mongoose');
// mongoose.set('strictQuery', true)
// mongoose.set('strictPopulate', false)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        } catch (err) {
        console.log('DB Connection error ', err);
    }
}

module.exports = connectDB