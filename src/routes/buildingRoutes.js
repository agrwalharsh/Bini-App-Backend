const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

router.post('/buildingRegistration', buildingController.registerBuilding);

module.exports = router;