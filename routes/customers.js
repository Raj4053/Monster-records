const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({name: 1});
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    //Error 404: Customer not Found
    if(!customer) return res.status(404).send('Customer with given id is not found');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    //Error 404: Cutomer not Found
    if(!customer) return res.status(404).send('Customer with given id is not found');

    res.send(customer);
});

router.post('/', async (req, res) => {
    //Error 400: Bad Request
    const {error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();

    res.send(customer);
});

router.put('/:id', async(req, res) => {
    //Error 400: Bad Request
    const {error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {new: true});
    //Error 404: Cutomer not Found
    if(!customer) return res.status(404).send('Customer with given id is not found');

    res.send(customer);
})

module.exports = router;


