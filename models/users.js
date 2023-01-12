const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  instagram: { type: String },
  twitter: { type: String },
  github: { type: String },
});

module.exports = mongoose.model("Users", userSchema);
