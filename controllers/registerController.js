//NEED TO CONVERT DB Connection to MongoDB

const usersDB = require('../model/User')



// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');


const bcrypt = require('bcrypt');
const ROLES_LIST = require('../config/roles_list');
const User = require('../model/User');

const defaultRole = ROLES_LIST.User


const handleNewUser = async (req, res) => {
    
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db

    const duplicate = usersDB.find(user)
  
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
}

module.exports = { handleNewUser };