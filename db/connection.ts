import mongoose from "mongoose";
const ENV: string = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not set");
}
const uri: string = process.env.MONGODB_URI;
const options = {
  // Add any necessary Mongoose connection options here
};
const connection = mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

export default connection;
