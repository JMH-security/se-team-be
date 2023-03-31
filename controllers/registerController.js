//NEED TO CONVERT DB Connection to MongoDB
const User = require('../model/User')
const Note = require('../model/Notes')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const ROLES_LIST = require('../config/roles_list');


const defaultRole = ROLES_LIST.User


const handleNewUser = asyncHandler(async (req, res) => {
    
    const { user, pwd, userRoles } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db

    const duplicate = User.find({ username: user })
  
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser = {
            "username": user,
            "roles": {"User":defaultRole},
            "password": hashedPwd
        };
        console.log(newUser)
       
        // usersDB.setUsers([...usersDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
       
        const user = await User.create(newUser)

        console.log("Line 43: ",usersDB.users);
        
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
})

module.exports = { handleNewUser };