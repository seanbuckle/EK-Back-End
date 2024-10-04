import express from "express";
import model from "../models/model";
import mongoose, { ObjectId } from "mongoose";
import { match } from "assert";
const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  try {
    const data = await model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
// POST new user
router.post("/new-user", (req, res) => {
  const data = new model({
    name: req.body.name,
    username: req.body.username,
    items: req.body.items,
    address: req.body.address,
    matches: req.body.matches,
  });
  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

//GET by user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const data = await model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
router.get("/user/:username", async (req, res) => {
  try {
    const data = await model.findOne({ username: req.params.username });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//GET items by ID
router.get("/items/:id", async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  try {
    const data = await model.aggregate([
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
      { $match: { _id: id } },
    ]);
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//GET all items
router.get("/items", async (req, res) => {
  try {
    const data = await model.aggregate([
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

//PATCH user
router.patch("/items/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const updatedData = req.body;
    const data = updatedData.likes;
    const options = { new: true };

    const result = await model.findOneAndUpdate(
      { "items._id": id },
      { $addToSet: { "items.$.likes": data } },
      options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

//DELETE user by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await model.findByIdAndDelete(id);
    if (data) {
      res.send(`Document with ${data.name} has been deleted.`);
    } else {
      res.status(404).json({ message: "Document not found." });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/matches", async (req, res) => {
  const id = new mongoose.Types.ObjectId(`${req.body.user_id}`);
  try {
    const data = await model.find({ _id: id }, { matches: 1 });
    res.json(data[0].matches);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/matchcheck", async (req, res) => {
  const user_id = req.body.user_id;
  const item_id = new mongoose.Types.ObjectId(`${req.body.item_id}`);
  try {
    const getTheirId = await model.findOne(
      { "items._id": item_id },
      { _id: 1, username: 1 }
    );
    const getTheirItem = await model.aggregate([
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
      { $match: { _id: item_id } },
    ]);
    const their_id = getTheirId!._id.toString();
    const theirObj = {
      their_user_id: their_id,
      their_user_name: getTheirId?.username,
      their_item_name: getTheirItem[0].item_name,
      their_img_string: getTheirItem[0].img_string,
      their_item_id: item_id,
    };

    const user_match_check = await model.findOne({
      $and: [{ _id: user_id }, { "items.likes": their_id }],
    });
    const options = { new: true, upsert: true };
    const their_id_check = await model.findOne({
      "matches.their_item_id": item_id,
    });

    if (user_match_check !== null && their_id_check === null) {
      const updateMatches = await model.findOneAndUpdate(
        { _id: user_id },
        { $addToSet: { matches: theirObj } },
        options
      );
      const userItem = user_match_check.items.map((item) => {
        if (item.likes.includes(their_id)) {
          return item;
        }
      });
      const userItemId = userItem[0]?._id.toString();
      const ourObj = {
        their_user_id: user_id,
        their_user_name: user_match_check.username,
        their_item_name: userItem[0]?.item_name,
        their_img_string: userItem[0]?.img_string,
        their_item_id: userItemId,
      };
      const updateTheirMatches = await model.findOneAndUpdate(
        { _id: their_id },
        { $addToSet: { matches: ourObj } },
        options
      );
      res.send([updateMatches, updateTheirMatches]);
    } else {
      res.send({ msg: "failure" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
