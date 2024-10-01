"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("../models/model"));
const router = express_1.default.Router();
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/post', (req, res) => {
    const data = new model_1.default({
        name: req.body.name,
        username: req.body.username,
        items: req.body.items,
        address: req.body.address
    });
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Get by ID Method
router.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.findById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.findOne({ "items._id": `${req.params.id}` }, { "items.$": 1 });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.aggregate([{ $unwind: "$items" }, { $replaceRoot: { newRoot: "$items" } }]);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//Update by ID Method
router.patch('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = yield model_1.default.findByIdAndUpdate(id, updatedData, options);
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
//Delete by ID Method
router.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = yield model_1.default.findByIdAndDelete(id);
        if (data) {
            res.send(`Document with ${data.name} has been deleted.`);
        }
        else {
            res.status(404).json({ message: "Document not found." });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
