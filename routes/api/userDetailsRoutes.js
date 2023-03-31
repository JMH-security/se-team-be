const express = require('express');
const router = express.Router();
const usersDetailsController = require('../../controllers/usersDetailsController')

router.route('/')
    .get(usersDetailsController.getAllUsersDetails)
    .post(usersDetailsController.createNewUserDetails)
    .patch(usersDetailsController.updateUserDetails)
    .delete(usersDetailsController.deleteUserDetails)

module.exports = router