const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createGlobalAdminController = require('../controllers/user/globalAdmin/createGlobalAdmin');
const updateBuildingAdminController = require('../controllers/user/buildingAdmin/updateBuildingAdmin')
const createBuildingAdminController = require('../controllers/user/buildingAdmin/createBuildingAdmin')
const generateTemporaryPasswordController = require('../controllers/user/authorization/userGenerateTempPassword')
const setPasswordController = require('../controllers/user/authorization/userSetPassword')

// Global Admin
router.post('/createGlobalAdmin', createGlobalAdminController.createGlobalAdmin);

// Building Admin
router.post('/createBuildingAdmin', validateAuth, createBuildingAdminController.createBuildingAdmin);

router.put('/updateBuildingAdmin', validateAuth, updateBuildingAdminController.updateBuildingAdmin);

// Gererate Temp Password
router.put('/generateTempPassword', validateAuth, generateTemporaryPasswordController.generateTemporaryPassword);

router.put('/setPassword', setPasswordController.setPassword);

module.exports = router;
