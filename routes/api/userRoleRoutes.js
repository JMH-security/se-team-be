const express = require('express');
const router = express.Router();
const userRoleController = require('../../controllers/userRolesController')

router.route('/')
    .get(userRoleController.getAllRoles)
    .post(userRoleController.createNewRole)
    .patch(userRoleController.updateUser)
    .delete(userRoleController.deleteUser)

module.exports = router