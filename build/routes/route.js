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
const api_json_1 = __importDefault(require("../../api.json"));
const router = express_1.default.Router();
// GET all users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(api_json_1.default);
}));
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield model_1.default.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST many new users at once
router.post("/manyusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insert = yield model_1.default.insertMany(req.body);
        res.send(insert);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
//post a new user
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
//get user by username
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
//PATCH user items by adding a like
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
//gets available trades
router.get("/trades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.body.user_id;
    const their_id = req.body.their_user_id;
    const getTheirItem = yield model_1.default.findOne({
        "matches.match_user_id": user_id,
    }, { matches: 1, username: 1 });
    const getOurItem = yield model_1.default.findOne({ "matches.match_user_id": their_id }, { matches: 1, username: 1 });
    res.send({
        user_matches: getOurItem.matches,
        their_matches: getTheirItem.matches,
    });
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
//gets an array of user matches
router.get("/matches/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(`${req.params.user_id}`);
    try {
        const data = yield model_1.default.find({ _id: id }, { matches: 1 });
        res.json(data[0].matches);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//checks whether a match has occured
router.post("/matchcheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user_id = new mongoose_1.default.Types.ObjectId(`${req.body.user_id}`);
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
            match_user_id: their_id,
            match_user_name: getTheirId === null || getTheirId === void 0 ? void 0 : getTheirId.username,
            match_item_name: getTheirItem[0].item_name,
            match_img_string: getTheirItem[0].img_string,
            match_item_id: item_id,
        };
        const user_match_check = yield model_1.default.findOne({
            $and: [{ _id: user_id }, { "items.likes": their_id }],
        });
        const options = { new: true, upsert: true };
        const their_id_check = yield model_1.default.findOne({
            "matches.match_item_id": item_id,
        });
        if (user_match_check !== null && their_id_check === null) {
            const updateMatches = yield model_1.default.findOneAndUpdate({ _id: user_id }, { $addToSet: { matches: theirObj } }, options);
            const userItem = user_match_check.items.map((item) => {
                if (item.likes.includes(their_id)) {
                    return item;
                }
            });
            const userItemId = (_a = userItem[0]) === null || _a === void 0 ? void 0 : _a._id.toString();
            const ourObj = {
                match_user_id: user_id,
                match_user_name: user_match_check.username,
                match_item_name: (_b = userItem[0]) === null || _b === void 0 ? void 0 : _b.item_name,
                match_img_string: (_c = userItem[0]) === null || _c === void 0 ? void 0 : _c.img_string,
                match_item_id: userItemId,
            };
            const updateTheirMatches = yield model_1.default.findOneAndUpdate({ _id: their_id }, { $addToSet: { matches: ourObj } }, options);
            res.send([updateMatches, updateTheirMatches]);
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
