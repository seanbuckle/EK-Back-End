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
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// GET all users
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST new user
router.post("/new-user", (req, res) => {
    const data = new model_1.default({
        name: req.body.name,
        username: req.body.username,
        items: req.body.items,
        address: req.body.address,
        matches: req.body.matches,
    });
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//GET by user by ID
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.findById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/user/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.findOne({ username: req.params.username });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//GET items by ID
router.get("/items/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.id);
    try {
        const data = yield model_1.default.aggregate([
            { $unwind: "$items" },
            { $replaceRoot: { newRoot: "$items" } },
            { $match: { _id: id } },
        ]);
        res.json(data[0]);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//GET all items
router.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.aggregate([
            { $unwind: "$items" },
            { $replaceRoot: { newRoot: "$items" } },
        ]);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//PATCH user
router.patch("/items/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const updatedData = req.body;
        const data = updatedData.likes;
        const options = { new: true };
        const result = yield model_1.default.findOneAndUpdate({ "items._id": id }, { $addToSet: { "items.$.likes": data } }, options);
        res.send(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
//DELETE user by ID
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get("/matchcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.body.user_id;
    const item_id = new mongoose_1.default.Types.ObjectId(`${req.body.item_id}`);
    try {
        const getTheirId = yield model_1.default.findOne({ "items._id": item_id }, { _id: 1, username: 1 });
        const getTheirItem = yield model_1.default.aggregate([
            { $unwind: "$items" },
            { $replaceRoot: { newRoot: "$items" } },
            { $match: { _id: item_id } },
        ]);
        const their_id = getTheirId._id.toString();
        const theirObj = {
            their_user_id: their_id,
            their_user_name: getTheirId === null || getTheirId === void 0 ? void 0 : getTheirId.username,
            their_item_name: getTheirItem[0].item_name,
            their_img_string: getTheirItem[0].img_string,
            their_item_id: item_id,
        };
        const user_match_check = yield model_1.default.findOne({
            $and: [{ _id: user_id }, { "items.likes": their_id }],
        });
        // const ourObj = {
        //     their_user_id: user_id,
        //   their_user_name: user_match_check.username,
        //   their_item_name: getTheirItem[0].item_name,
        //   their_img_string: getTheirItem[0].img_string,
        //   their_item_id: item_id,
        // }
        const options = { new: true, upsert: true };
        if (user_match_check !== null) {
            const updateMatches = yield model_1.default.findOneAndUpdate({ _id: user_id }, { $addToSet: { matches: theirObj } }, options);
            //   const updateTheirMatches = await model.findOneAndUpdate({_id: their_id}, {$addToSet: {matches: matches: }})
            res.send(updateMatches);
        }
        else {
            res.send({ msg: "failure" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
