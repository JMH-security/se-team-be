const User = require('../model/User')
const Note = require('../model/Notes')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get All Users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {

})

// @desc Create New User
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {

})

// @desc Update a User
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {

})

// @desc Delete a User
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser }

