const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createGlobalAdminController = require('../controllers/user/globalAdmin/createGlobalAdmin');
const updateBuildingAdminController = require('../controllers/user/buildingAdmin/updateBuildingAdmin')
const createBuildingAdminController = require('../controllers/user/buildingAdmin/createBuildingAdmin')
const generateTemporaryPasswordController = require('../controllers/user/authorization/userGenerateTempPassword')
const logInController = require('../controllers/user/authorization/userLogin')
const setPasswordController = require('../controllers/user/authorization/userSetPassword')
const createFlatAdminController = require('../controllers/user/flatAdmin/createFlatAdmin')
const getFlatAdminsController = require('../controllers/user/flatAdmin/getAllFlatAdmins')
const createSecurityUserController = require('../controllers/user/security/createSecurityUser')
const getSecurityUsersByBuildingController = require('../controllers/user/security/getSecurityUsersByBuilding')
const deleteFlatAdminController = require('../controllers/user/flatAdmin/deleteFlatAdmin')
const updateFlatAdminController = require('../controllers/user/flatAdmin/updateFlatAdmin')
const deleteSecurityUserController = require('../controllers/user/security/deleteSecurityUser')
const updateSecurityUserController = require('../controllers/user/security/updateSecurityUser')

// Global Admin
router.post('/createGlobalAdmin', createGlobalAdminController.createGlobalAdmin);

// Building Admin
router.post('/createBuildingAdmin', validateAuth, createBuildingAdminController.createBuildingAdmin);

router.put('/updateBuildingAdmin', validateAuth, updateBuildingAdminController.updateBuildingAdmin);

// Gererate Temp Password
router.put('/generateTempPassword', validateAuth, generateTemporaryPasswordController.generateTemporaryPassword);

// Set Password
router.put('/setPassword', setPasswordController.setPassword);

//Login
router.post('/login', logInController.loginUser);

// Flat Admin
router.post('/createFlatAdmin', validateAuth, createFlatAdminController.createFlatAdmin);

router.get('/getFlatAdmins', validateAuth, getFlatAdminsController.getFlatAdminsByBuilding);

router.delete('/deleteFlatAdmin', validateAuth, deleteFlatAdminController.deleteFlatResident)

router.put('/updateFlatAdmin', validateAuth, updateFlatAdminController.updateFlatAdmin)

// Security User
router.post('/createSecurityUser', validateAuth, createSecurityUserController.createSecurityUser)

router.get('/getSecurityUsers', validateAuth, getSecurityUsersByBuildingController.getSecurityUsersByBuilding)

router.delete('/deleteSecurityUser', validateAuth, deleteSecurityUserController.deleteSecurityUser)

router.put('/updateSecurityUser', validateAuth, updateSecurityUserController.updateSecurityUser)

module.exports = router;
