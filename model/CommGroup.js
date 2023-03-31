const mongoose = require('mongoose')

const commGroupSchema = new mongoose.Schema(
    {
    commGroupName: {
        type: String,
        required: true
    },
    commGroupDescription: {
        type: String
    },
    commGroupActive: {
        type: Boolean,
        default: true
    }
    },{
        timestamps: true
    }
)

module.exports = mongoose.model('CommGroup', commGroupSchema)