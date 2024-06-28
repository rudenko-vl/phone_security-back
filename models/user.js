import mongoose from "mongoose";

const gadgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  sn: { type: String, required: true },
  image: { type: String, required: false },
  purchasedOn: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  position: { type: String, required: false },
  image: { type: String, required: false },
  gadgets: [gadgetSchema],
});

export default mongoose.model("User", UserSchema);
