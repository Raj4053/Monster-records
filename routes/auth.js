const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const {User } = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
    //Error 400: Bad Request(something wrong with info in req.body)
    const {error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Don't want to tell user what is wrong(i.e. give them vague message)
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invali email or Password');

    //Don't want to tell user what is wrong(i.e. give them vague message)
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invali email or Password');

    res.send(true);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;