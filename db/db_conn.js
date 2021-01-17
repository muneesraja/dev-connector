const mongoose = require("mongoose");
const config = require("config");
const colors = require("colors");
const db = config.get("data.db");

const db_conn = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connected...".bgGreen.black);
  } catch (error) {
    console.log(`Error connecting to the DB: ${error}`.red);
    process.exit(1);
  }
};

module.exports = db_conn;
