require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var cors = require('cors')

const app = express();
const port = 8000;

app.use(cors())

const { Count } = require('./model/count.js')
const { Data } = require('./model/data.js')

console.log(Count);

console.log(process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

app.use(bodyParser.json());

app.post('/content/:id', async (req, res) => {
    const id = req.params.id
    const { data } = req.body
    console.log(req.body);
    try {
        const existingData = await Data.findOne({ id })
        if (existingData != null)
            await Data.deleteOne({ id })
        const newData = new Data({ data, id });
        const savedData = await newData.save();
        await increaseCount(savedData.id); // Update count
        res.json(savedData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// Update endpoint
app.put('/content/:id', async (req, res) => {
    const id = req.params.id

    const { data } = req.body
    console.log(data);
    try {
        let existingData = await Data.findOne({ id })
        let updatedData
        if (existingData == null) {
            const newData = new Data({ id, data })
            updatedData = await newData.save()
        }
        else
            updatedData = await Data.findOneAndUpdate({ id }, { data }, { new: true });
        console.log(updatedData);
        increaseCount(updatedData.id)
        res.json(updatedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Count endpoint
app.get('/count/:id', async (req, res) => {
    const id = req.params.id
    console.log(id);
    try {
        let count = await Count.findOne({ id });
        if (count == null)
            count = new Count({ count: 0, id })
        res.json({ count: count.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper function to increment count
const increaseCount = async (id) => {
    try {
        let updatedCount
        const countDoc = await Count.findOne({ id })
        if (countDoc == null) {
            const newCount = new Count({ count: 1, id })
            updatedCount = await newCount.save()
        }
        else {
            countDoc.count++;
            updatedCount = await countDoc.save();
        }
    } catch (err) {
        console.error(err); // Handle error gracefully
    }
};

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
