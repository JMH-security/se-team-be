const User = require('../model/User')
const asyncHandler = require('express-async-handler')

const bcrypt = require('bcrypt')

//TO DO - NEED TO SORT OUT ROLES BETTER - HARD CODED RIGHT NOW
const ROLES_LIST = require('../config/roles_list');
const defaultRole = ROLES_LIST.User

const handleNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' })
    }
    
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ user: username }).lean().exec()
    if (duplicate) { 
        return res.sendStatus(409).json({ message: `Username ${username} in use`})
    }
        
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //store the new user
    const newUser = {
        user: username,
        userRoles: ["User", "Admin"],
        password: hashedPwd
    }

    const user = await User.create(newUser)

    if (user) {    
        res.status(201).json({ success: `New user ${user} created!` });
    } else {
        res.status(400).json({ message: 'Invalid User Data Received' });
    }
})

module.exports = { handleNewUser }