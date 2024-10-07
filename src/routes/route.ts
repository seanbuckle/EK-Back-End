import express from "express";
import model from "../models/model";
import mongoose, { ObjectId } from "mongoose";
import { match } from "assert";
import api from "../../api.json";
const router = express.Router();

// GET all users

router.get("/", async (req, res) => {
  res.send(api);
});

router.get("/users", async (req, res) => {
  try {
    const data = await model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
// POST many new users at once
router.post("/manyusers", async (req, res) => {
  try {
    const insert = await model.insertMany(req.body);
    res.send(insert);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});
//post a new user
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
//get user by username
router.get("/user/:username", async (req, res) => {
  try {
    const data = await model.findOne({ username: req.params.username });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//Brings back an array of liked items for a user
router.get("/likes/:user_id", async (req, res) => {
  const id = req.params.user_id;
  try {
    const data = await model.find({ "items.likes": id }, { items: 1, _id: 0 });
    const filt = data[0].items.filter((item) => {
      if (item.likes.includes(id)) {
        return item;
      }
    });
    res.json(filt);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//GET a users Items from the database
router.get("/:username/items", async (req, res) => {
  const username = req.params.username;
  try {
    const data = await model.findOne(
      { username: username },
      { items: 1, _id: 0 }
    );
    res.json(data!.items);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//POST add a new items to your items
router.post("/items/:username", async (req, res) => {
  const username = req.params.username;
  const newItem = {
    item_name: req.body.item_name,
    description: req.body.description,
    img_string: req.body.img_string,
    likes: [],
  };
  const options = { new: true };
  const data = await model.findOneAndUpdate(
    { username: username },
    { $addToSet: { items: newItem } },
    options
  );
  res.status(201).send(data);
});

//GET items by item_ID
router.get("/items/:id", async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  try {
    const data = await model.aggregate([
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
      { $match: { _id: id } },
    ]);
    console.log(data);
    // res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//GET all items
router.get("/items", async (req, res) => {
  const username = req.query.username;
  try {
    const data = await model.aggregate([
      { $match: { username: { $ne: username } } },
      { $unwind: "$items" },
      { $replaceRoot: { newRoot: "$items" } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
router.get("/tradesuccess/", async (req, res) => {});

router.post("/settrade", async (req, res) => {
  const match_id = new mongoose.Types.ObjectId(`${req.body.match_id}`);
  const val = req.body.bool;
  console.log(match_id);
  const changeBool = await model.findOneAndUpdate(
    { "matches._id": match_id },
    { $set: { settrade: false } }
  );
  res.send(changeBool);
});

//PATCH user items by adding a like
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
//gets available trades
router.get("/trades/:user_id/:their_user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const their_id = req.params.their_user_id;
  const getTheirItem = await model.findOne(
    {
      "matches.match_user_id": user_id,
    },
    { matches: 1, username: 1 }
  );
  const getOurItem = await model.findOne(
    { "matches.match_user_id": their_id },
    { matches: 1, username: 1 }
  );

  if (getOurItem && getTheirItem) {
    res.send({
      user_matches: getOurItem!.matches,
      their_matches: getTheirItem!.matches,
    });
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
//gets an array of user matches
router.get("/matches/:user_id", async (req, res) => {
  const id = new mongoose.Types.ObjectId(`${req.params.user_id}`);
  try {
    const data = await model.find({ _id: id }, { matches: 1 });
    res.json(data[0].matches);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
//checks whether a match has occured
router.post("/matchcheck", async (req, res) => {
  const user_id = new mongoose.Types.ObjectId(`${req.body.user_id}`);
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
      match_user_id: their_id,
      match_user_name: getTheirId?.username,
      match_item_name: getTheirItem[0].item_name,
      match_img_string: getTheirItem[0].img_string,
      match_item_id: item_id,
    };

    const user_match_check = await model.findOne({
      $and: [{ _id: user_id }, { "items.likes": their_id }],
    });
    const options = { new: true, upsert: true };
    const their_id_check = await model.findOne({
      "matches.match_item_id": item_id,
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
        match_user_id: user_id,
        match_user_name: user_match_check.username,
        match_item_name: userItem[0]?.item_name,
        match_img_string: userItem[0]?.img_string,
        match_item_id: userItemId,
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
