const User = require('../model/User')
const UserRole = require('../model/UserRoles')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//TO DO - NEED TO SORT OUT ROLES BETTER - HARD CODED RIGHT NOW
const ROLES_LIST = require('../config/roles_list');


const handleNewUser = asyncHandler(async (req, res) => {
    const { username, password, userAccountStatus } = req.body

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
    const defaultRole = await UserRole.findOne({roleCode: '1001'}).lean().exec()

    // For adding multiple roles
    // const adminRole = await UserRole.findOne({roleCode: '9999'}).lean().exec()
    // const allRoles = [defaultRole, adminRole]
    

    //store the new user
    
    const newUser = {
        user: username,
        userRoles: defaultRole,
        password: hashedPwd,
        userAccountStatus
    }
    const user = await User.create(newUser)

    if (user) {    
        res.status(201).json({ success: `New user ${user} created!` });
    } else {
        res.status(400).json({ message: 'Invalid User Data Received' });
    }
})

module.exports = { handleNewUser }