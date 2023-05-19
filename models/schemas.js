//import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";
const ItemSchema = new Schema({
  examine: String,
  members: Boolean,
  lowalch: Number,
  limit: Number,
  value: Number,
  highalch: Number,
  icon: String,
  name: String,
  osrs_id: Number,
  prices: Array,
});

const UserSchema = new Schema({
  name: String,
  email: String,
  trackedItems: Array,
  percentDifference: Number,
});

export const item = models.item || model("item", ItemSchema);
export const user = models.user || model("user", UserSchema);
