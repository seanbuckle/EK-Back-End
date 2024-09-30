import express from 'express'
import model from '../models/model'
import { Types } from 'mongoose'
const router = express.Router()


router.get('/getAll', async (req, res) => {
    try{
        const data = await model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})

router.post('/post', (req, res) => {
    const data = new model({
        name: req.body.name,
        age: req.body.age
    })
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: (error as Error ).message})
    }
})


//Get by ID Method
router.get('/getOne/:id', async(req, res) => {
    try{
        const data = await model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: (error as Error).message})
    }
})

//Update by ID Method
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

//Delete by ID Method
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