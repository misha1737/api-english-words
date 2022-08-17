const mongoose = require("../libs/mongoose");
Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

exports.Topic = mongoose.model("Topic", schema);
