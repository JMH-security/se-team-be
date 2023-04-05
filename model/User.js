const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserRole'
    }],
    userAccountStatus: {
        type: Boolean,
        default: true
    }
    },{
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)