const CommGroup = require('../model/CommGroup')
const asyncHandler = require('express-async-handler')

// @desc Get All Communication Groups
// @route GET /groups
// @access Private

const getAllCommGroups = asyncHandler(async (req, res) => {
    const allCommGroups = await CommGroup.find()
    if (!allCommGroups?.length) {
        return res.status(400).json({ message: 'No Groups Found Shitbird'})
    }
    return res.json(allCommGroups)
})

// @desc Create New Communication Group
// @route POST /groups
// @access Private

const createNewCommGroup = asyncHandler(async (req, res) => {
    const { commGroupName, commGroupDescription, commGroupActive } = req.body

    // Confirm data
    if (!commGroupName || !commGroupDescription || typeof commGroupActive !== 'boolean' ) {
        return res.status(400).json({ message: 'All group fields are required' })
    }

    // Check for duplicate comm group name
    const duplicate = await CommGroup.findOne({ commGroupName }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Group Name already in Use' })
    }

    const commGroupObject = { commGroupName, commGroupDescription, commGroupActive }

    // Create and store new group 
    const commGroup = await CommGroup.create(commGroupObject)

    if (commGroup) { //created 
        res.status(201).json({ message: `New group ${commGroupName} created` })
    } else {
        res.status(400).json({ message: 'Invalid group data received' })
    }
})

// @desc Update a Group
// @route PATCH /groups
// @access Private

const updateCommGroup = asyncHandler(async (req, res) => {
    const { id, commGroupName, commGroupDescription, commGroupActive } = req.body

    //confirm data
    if ( !id || !commGroupName || !commGroupDescription || typeof commGroupActive !== 'boolean') {
       
        return res.status(400).json({ message: 'All comm group fields are required ya fool' })
    }

    const updateCommGroupObject = await CommGroup.findById(id).exec()
    if (!updateCommGroupObject) {
        return res.status(400).json({ message: `Communcation Group: ${commGroupName} not found`})
    }

    //check for dup
    const duplicate = await CommGroup.findOne({ commGroupName }).lean().exec()
    //allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Select Group Name Already In Use'})
    }
    updateCommGroupObject.id = id
    updateCommGroupObject.commGroupName = commGroupName
    updateCommGroupObject.commGroupDescription = commGroupDescription
    updateCommGroupObject.commGroupActive = commGroupActive
    
    
    const updatedCommGroup = await updateCommGroupObject.save()
    res.json({ message: `${updatedCommGroup.commGroupName} updated - Allez!!!`})
})

// @desc Delete a Communication Group
// @route DELETE /groups
// @access Private

const deleteCommGroup = asyncHandler(async (req, res) => {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({ message: 'Comm Group ID Required' })
        }

        const deletedCommGroup = await CommGroup.findById(id).exec()
        if (!deletedCommGroup){
            return res.status(409).json({ message: 'Group ID Not Found' })
        }
        const result = await deletedCommGroup.deleteOne()
        return res.status(200).json({ message: `Group with id ${id} deleted, username: ${deletedCommGroup.commGroupName}`})
})

module.exports = { getAllCommGroups, createNewCommGroup, updateCommGroup, deleteCommGroup }

