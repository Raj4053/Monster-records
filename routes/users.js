const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

router.post('/', async (req, res) => {
    //Error 400: Bad Request(something wrong with the info in req.body)
    const {error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Error 400: Bad Request(User already registered)
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already Registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //Hashing Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;