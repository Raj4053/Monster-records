const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    phone: {
        type: String,
        length: 10,
        required: true,
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        phone: Joi.string().length(10).required(),
        isGold: Joi.boolean().required()
    });
    
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;