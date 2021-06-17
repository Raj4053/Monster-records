const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const asyncMiddleware = require('../middleware/async');

router.get("/", asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

router.get("/:id", asyncMiddleware(async (req, res) => {
    //If not found : Error 404
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Genre not Found');

    res.send(genre);
}));

router.delete("/:id", asyncMiddleware(async (req, res) => {
    //If not found : Error 404
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send('Genre not Found'); 

    //If found : Delete
    res.send(genre);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    //Validation of id/genre name(Bad Request) : Error 404
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //getting the id
    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    //Invalid: Error 400
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //If not found: Error 404
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });
    if(!genre) return res.status(404).send('Genre with given ID is not Found');


    //If found: Update and Return  
    res.send(genre);
}));

module.exports = router;