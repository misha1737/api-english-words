const mongoose = require("mongoose");
async function start() {
  try {
    await mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    });
    console.log(`mongoose connected on *mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  } catch (e) {
    console.log(e);
  }
}
start();
module.exports = mongoose;
