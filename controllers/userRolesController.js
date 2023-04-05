const User = require('../model/User')
const UserRole = require('../model/UserRoles')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get All Roles
// @route GET /roles
// @access Private

const getAllRoles = asyncHandler(async (req, res) => {
    const allRoles = await UserRole.find().lean()
    if (!allRoles?.length) {
        return res.status(400).json({ message: 'No Roles Found Shitbird'})
    }
    return res.json(allRoles)
})

// @desc Create New Role
// @route POST /roles
// @access Private

const createNewRole = asyncHandler(async (req, res) => {
    const { role, roleCode } = req.body

    // Confirm data
    if (!role || !roleCode) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await UserRole.findOne({ role }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Role Already In Database' })
    }

    const roleObject = { role, roleCode }

    // Create and store new user 
    const addRole = await UserRole.create(roleObject)

    if (addRole) { //created 
        res.status(201).json({ message: `New Role ${role} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }
})

// @desc Update a Role
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    //confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
       
        return res.status(400).json({ message: 'All fields are required ya fool' })
    }

    const updateUserObject = await User.findById(id).exec()
    if (!updateUserObject) {
        return res.status(400).json({ message: `User ${username} not found`})
    }

    //check for dup
    const duplicate = await User.findOne({ username }).lean().exec()
    //allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Updated username already exists'})
    }
    updateUserObject.id = id
    updateUserObject.user = username
    updateUserObject.userRoles = roles
    updateUserObject.userAccountStatus = active

    if (password) {
        //hash password
        updateUserObject.password = await bcrypt.hash(password, 10)
    }
    console.log(updateUserObject)
    const updatedUser = await updateUserObject.save()
    res.json({ message: `${updatedUser.user} updated - Let's Go!!!`})
})

// @desc Delete a User
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({ message: 'User ID Required' })
        }

        const notes = await Note.findOne({ user: id }).lean().exec()
        if (notes) {
            return res.status(400).json({ message: 'User has assigned notes ya heard?'})
        }

        const deletedUser = await User.findById(id).exec()
        if (!deletedUser){
            return res.status(409).json({ message: 'User Id Not Found' })
        }
        const result = await deletedUser.deleteOne()
        return res.status(200).json({ message: `id ${id} deleted, username: ${deletedUser.user}`})
})

module.exports = { getAllRoles, createNewRole, updateUser, deleteUser }

