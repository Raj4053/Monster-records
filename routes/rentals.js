const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validate} = require('../models/rental');
const { Movie } = require('../models/movie');
const {Customer} = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async(req, res) => {
    //Error 400: Bad Request(something wrong with info provided in req.body)
    const {error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    //Error 400: Invalid Customer
    if(!customer) return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    //Error 400: Invalid Movie
    if(!movie) return res.status(400).send('Invalid Movie');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in Stock');
    
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {numberInStock: -1}
            })
            .run();
            
        res.send(rental);
    } catch(ex) {
        //Error 500: Internal Server Error 
        res.status(500).send('Something failed');
    }

});

module.exports = router;