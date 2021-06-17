const mongoose = require('mongoose');
const express = require("express");
const helmet = require('helmet');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const users = require('./routes/users');
const auth = require('./routes/auth');
const rentals = require('./routes/rentals');
const error = require('./middleware/error');

//For connecting to mongoose
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));


app.use(express.json());
app.use(helmet());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/rentals', rentals);
app.use('/api/auth', auth);
//For catching unhandled promises/Errors(should be at last)
app.use(error);

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Listening on port ${port}..`));
