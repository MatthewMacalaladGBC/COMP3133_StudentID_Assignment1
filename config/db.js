import dns from "dns";

// Force IPv4 DNS 
// DNS issue when connecting to MongoDB on home internet, quick fix by forcing IPv4 instead of IPv6
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.${process.env.CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;