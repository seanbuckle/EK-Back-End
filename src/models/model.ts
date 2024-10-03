import mongoose, { Schema } from "mongoose";

const itemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img_string: {
    type: String,
    required: true,
  },
  likes: {
    type: [],
  },
});

const matchSchema = new mongoose.Schema({
  their_item_name: {
    type: String,
    required: true,
  },
  their_user_name: {
    type: String,
    required: true,
  },
  their_img_string: {
    type: String,
    required: true,
  },
  their_user_id: {
    type: String,
    required: true,
  },
});

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  post_code: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  items: [itemSchema],
  address: [addressSchema],
  matches: {
    required: true,
    type: [matchSchema],
  },
});

export default mongoose.model(`Data`, userSchema);
