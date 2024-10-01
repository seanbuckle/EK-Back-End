"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
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
});
const addressSchema = new mongoose_1.default.Schema({
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
});
const userSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model(`Data`, userSchema);
