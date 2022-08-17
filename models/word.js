const mongoose = require("../libs/mongoose");
Schema = mongoose.Schema;

const schema = new Schema(
  {
    word: {
      type: String,
      required: true
    },
    translate: {
      type: String,
      required: true
    },
    learned:{
      type: Boolean,
      required: true
    },
    topicID:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

exports.Word = mongoose.model("Word", schema);
