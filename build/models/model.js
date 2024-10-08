"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.Schema.ObjectId,
    },
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
const matchSchema = new mongoose_1.default.Schema({
    match_item_name: {
        type: String,
        required: true,
    },
    match_user_name: {
        type: String,
        required: true,
    },
    match_img_string: {
        type: String,
        required: true,
    },
    match_user_id: {
        type: String,
        required: true,
    },
    match_item_id: {
        type: String,
        required: true,
    },
    settrade: {
        type: Boolean,
    },
    matching_id: {
        type: String,
        required: true,
    },
});
const addressSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.Schema.ObjectId,
    },
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
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.Schema.ObjectId,
    },
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
exports.default = mongoose_1.default.model(`Data`, userSchema);
