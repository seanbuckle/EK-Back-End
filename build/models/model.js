"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    itemName: {
        type: String,
        required: true
    }
});
const dataSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model(`Data`, dataSchema);
