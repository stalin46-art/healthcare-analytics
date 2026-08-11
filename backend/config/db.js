const mongoose = require("mongoose");

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || process.env.DB_URL;

  if (!rawUri) {
    console.error(
      "MongoDB connection string is not set. Set MONGO_URI or DB_URL in your .env file."
    );
    process.exit(1);
  }

  const uri = /^mongodb(\+srv)?:\/\//.test(rawUri)
    ? rawUri
    : `mongodb://${rawUri}`;

  try {
    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;