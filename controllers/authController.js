//NEED TO CONVERT DB Connection to MongoDB

const User = require('../model/User')
const UserRoles = require('../model/UserRoles')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await User.findOne({ user });

    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = foundUser.userRoles
        const roleCode = await UserRoles.find({ "_id": roles })
        console.log({ roleCode })

        console.log(roles)
        // create JWTs
        const accessToken = await jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.user,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.user },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        //const otherUsers =  User.filter(person => person.user !== foundUser.user);
        const currentUser = { ...foundUser, refreshToken };
        await User.findOneAndUpdate({ currentUser });
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ roles, accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };