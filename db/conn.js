const mongoose=require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: './.env' })

const connectDB = async () => {
    try { 
     await mongoose.connect(process.env.DB);
      console.log('Mongodb connected');
    } catch (error) {
      console.log('Mongodb Server Issue');
    }
  };

module.exports = connectDB;

