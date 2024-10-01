import express from 'express'
import model from '../models/model'
import { ObjectId } from 'mongoose'
const router = express.Router()

// GET all users
router.get('/users', async (req, res) => {
    try{
        const data = await model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})
// POST new user
router.post('/new-user', (req, res) => {
    const data = new model({
        name: req.body.name,
        username: req.body.username,
        items: req.body.items,
        address: req.body.address
    })
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: (error as Error ).message})
    }
})


//GET by user by ID 
router.get('/users/:id', async(req, res) => {
    try{
        const data = await model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})
//GET items by ID
router.get('/items/:id', async(req, res) => {
    try{
        const data = await model.findOne( { "items._id": `${req.params.id}` }, { "items.$": 1 } );
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})
//GET all items
router.get('/items', async(req, res) => {
    try{
        const data = await model.aggregate([ { $unwind: "$items" }, { $replaceRoot: { newRoot: "$items" } }])
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})

//PATCH user
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message })
    }
})

//DELETE user by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await model.findByIdAndDelete(id)
        if (data) { res.send(`Document with ${data.name} has been deleted.`); } 
        else { res.status(404).json({ message: "Document not found." }); }
    }
    catch (error) {
        res.status(400).json({ message: (error as Error).message })
    }
})

export default router