const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/createUser');

router.post('/createUser', userController.createUser);

module.exports = router;
