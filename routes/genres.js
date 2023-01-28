const autho = require('../middleware/autho');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

//Adding new genre
router.post('/', autho, async(req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

//Updating a genre
router.put('/:id', async(req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The preferred genre (id) was not found'); 
   
  res.send(genre);
});

//Deleting a genre
router.delete('/:id', [autho, admin], async(req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The preferred genre (id) was not found'); 

  res.send(genre);
});

router.get('/:id', async(req, res) => {
  const genre = await Genre.findById(req.params.id)

  if (!genre) return res.status(404).send('The genre of given ID was not found'); 
  
  res.send(genre); 
});

module.exports = router;