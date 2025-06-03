const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yourDBname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const LeaderboardSchema = new mongoose.Schema({
  id: Number,
  name: String,
  score: Number
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);


app.use(express.json());


app.get('/list', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({});
    res.json(leaderboard);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching leaderboard' });
  }
});






app.post('/list', async (req, res) => {
  try {
    const { name, score } = req.body;
    const newEntry = new Leaderboard({ name, score });
    await newEntry.save();
    res.status(201).json(newEntry);

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});




app.put('/list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, score } = req.body;

    const updated = await Leaderboard.findOneAndUpdate(
      { _id: id },
      { name, score },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});






app.delete('/list/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Leaderboard.findOneAndDelete({ _id : id});



    res.json({ message: 'Entry deleted', deleted });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server working on PORT : ${PORT}`);
});
