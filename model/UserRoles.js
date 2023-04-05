const mongoose = require('mongoose') 

const userRoleSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true
        },
        roleCode: {
            type: String,
            required: true
        },
        activeRole: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('UserRole', userRoleSchema)