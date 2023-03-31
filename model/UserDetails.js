const mongoose = require('mongoose') 

const userDetailsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        employeeNumber: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        cellPhone: {
            type: String
        },
        personalEmail: {
            type: String
        },
        doNotText: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('UserDetails', userDetailsSchema)