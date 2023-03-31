const UsersDetails = require('../model/UserDetails')
const User = require('../model/User')
const Note = require('../model/Notes')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get All Employee Details
// @route GET /
// @access Private

const getAllUsersDetails = asyncHandler(async (req, res) => {

    const allUserDetails = await UsersDetails.find().lean()

    if (!allUserDetails?.length) {
        return res.status(400).json({ message: 'No Users Details Found Amigo'})
    }
    return res.json(allUserDetails)
})

// @desc Create New User
// @route POST /users
// @access Private

const createNewUserDetails = asyncHandler(async (req, res) => {
    const { user, employeeNumber, firstName, lastName, cellPhone, personalEmail, doNotText } = req.body

    // Confirm data
    if (!user || !employeeNumber || !firstName || !lastName || !cellPhone || !personalEmail ) {
        console.log({
            user,
            employeeNumber,
            firstName,
            lastName,
            cellPhone,
            personalEmail,
            doNotText
        })
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ user }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'User has details on file. Please edit' })
    }

    const userDetailsObject = { user, employeeNumber, firstName, lastName, cellPhone, personalEmail, doNotText }

    // Create and store new user 
    
  
    console.log(duplicate)

    const addUserDetails = await UsersDetails.create(userDetailsObject)

    if (addUserDetails) { //created 
        res.status(201).json({ message: `Details created for ${employeeNumber}` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a User
// @route PATCH /users
// @access Private

const updateUserDetails = asyncHandler(async (req, res) => {
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

const deleteUserDetails = asyncHandler(async (req, res) => {
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

module.exports = { getAllUsersDetails, createNewUserDetails, updateUserDetails, deleteUserDetails }

