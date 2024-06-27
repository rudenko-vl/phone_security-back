const mongoose = require("mongoose");
const { Schema } = mongoose;

const GadgetSchema = new Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  sn: { type: String, required: true },
  image: { type: String },
});

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  position: { type: String },
  image: { type: String },
  gadgets: [GadgetSchema],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
