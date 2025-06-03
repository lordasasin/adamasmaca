require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const express = require('express');
const app = express();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas bağlantısı başarılı!');
  } catch (err) {
    console.error('Hata:', err);
  }
}

const TodoListSchema = new mongoose.Schema({
  id: Number,
  list: String

});

const Todolist = mongoose.model('TodolistSchema', TodoListSchema);


app.use(express.json());


app.get("/todo", async (req, res) => {
  try {
    const todolist = await Todolist.find({});
    res.json(todolist);
  } catch (err) {
    console.log('Hata: ', err);
  }
})

app.get("/todo/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const todolist = await Todolist.findOne(
      { _id : id });
    res.json(todolist);
  } catch (err) {
    console.log('Hata: ', err);
  }
})

app.post("/todo", async (req, res) => {
  try {
    const { list } = req.body;
    const newEntry = new Todolist({ list });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.log('Hata: ', err);
  }
})

app.put("/todo/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const { list } = req.body;

    const updated = await Todolist.findOneAndUpdate(
      { _id : id },
      { list },
      { new: true }
    );

    res.json(updated);




  } catch (err) {
    console.log('Hata: ', err);
  }
})

app.delete("/todo/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await Todolist.findOneAndDelete({ _id : id });

    

      res.json({ message: 'deleted', deleted });




  } catch (err) {
    console.log('Hata: ', err);
  }
})

app.listen(process.env.PORT, (req, res) => {

  try {
    console.log("Express sunucusu başlatıldı!");
  } catch (err) {
    console.log(err);
  }
})




connectToDB();
