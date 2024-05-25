const express = require('express');
const { validateAuth } = require('../auth/auth');
const router = express.Router();
const createBuildingController = require('../controllers/building/createBuilding');
const createBuildingAdminController = require('../controllers/building/createBuildingAdmin')

router.post('/buildingRegistration',  validateAuth, createBuildingController.createBuilding);

router.post('/buildingAdminRegistration',  validateAuth, createBuildingAdminController.createBuildingAdmin);

module.exports = router;