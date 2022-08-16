var mongoose = require("../libs/mongoose");
Schema = mongoose.Schema;

var schema = new Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    logoUrl:{
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

exports.User = mongoose.model("User", schema);
