import mongoose from "mongoose";

const ConnectToDb = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    console.log("MongoDB Connection Error:");
    console.log(error.message);

    process.exit(1);
  }
};

export default ConnectToDb;