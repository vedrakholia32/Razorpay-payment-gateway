import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const connectToMongo = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log("Database Connected")
  } catch (error) {
    console.log(error);
  }
}

export default connectToMongo;