const express = require('express');
const router = express.Router();
const commGroupController = require('../../controllers/commGroupController')

router.route('/')
    .get(commGroupController.getAllCommGroups)
    .post(commGroupController.createNewCommGroup)
    .patch(commGroupController.updateCommGroup)
    .delete(commGroupController.deleteCommGroup)

module.exports = router