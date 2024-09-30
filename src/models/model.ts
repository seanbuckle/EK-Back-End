import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    }
})

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    items: {
        required: true,
        type: [itemSchema]
    }
})

export default mongoose.model(`Data`, dataSchema)