import mongoose, { Schema } from 'mongoose';

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
   description: {
        type: String,
        required: true
   },
   img_string: {
        type: String,
        required: true
   },
   likes: {
    type: []
   }
})

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    items: [itemSchema],
    address: [addressSchema]
})

export default mongoose.model(`Data`, userSchema)