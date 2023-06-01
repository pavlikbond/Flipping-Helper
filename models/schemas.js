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
  clerkId: String,
  email: String,
  trackedItems: Array,
  stripeId: String,
  plan: String,
  tracking: Boolean,
});

const PricingSchema = new Schema({
  name: String,
  tier1: {
    name: String,
    shortDescription: String,
    price: String,
    action: String,
    priceId: String,
    features: Array,
    limit: Number,
  },
  tier2: {
    name: String,
    shortDescription: String,
    price: String,
    action: String,
    priceId: String,
    features: Array,
    limit: Number,
  },
  tier3: {
    name: String,
    shortDescription: String,
    price: String,
    action: String,
    priceId: String,
    features: Array,
    limit: Number,
  },
});

const NewPricingSchema = new Schema({
  name: String,
  shortDescription: String,
  price: String,
  action: String,
  priceId: String,
  features: Array,
  limit: Number,
});

//export const item = models.item || model("item", ItemSchema);
export const Item = models?.Item || model("Item", ItemSchema);
//export const user = models.user || model("user", UserSchema);
export const User = models?.User || model("User", UserSchema);
//export const Pricing = models?.Pricing || model("Pricing", PricingSchema);
export const Pricing = models?.Pricing || model("Pricing", NewPricingSchema);
