const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

const DataSchema = new mongoose.Schema({
    value: String
});
const Data = mongoose.model('Data', DataSchema);

app.use(express.json());

app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/data', async (req, res) => {
    const { value } = req.body;
    if (!value) {
        return res.status(400).json({ error: 'Value is required' });
    }

    try {
        const newData = new Data({ value });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
