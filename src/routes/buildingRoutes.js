const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createBuildingController = require('../controllers/building/createBuilding')
const buildingListController = require('../controllers/building/allBuildingDetails')
const updateBuildingSubscriptionController = require('../controllers/building/updateBuildingSubscription')
const deleteBuildingController = require('../controllers/building/deleteBuilding')
const updateBuildingController = require('../controllers/building/updateBuilding')

// Building

router.post('/createBuilding', validateAuth, createBuildingController.createBuilding);

router.put('/updateBuilding', validateAuth, updateBuildingController.updateBuildingDetails);

router.delete('/deleteBuilding', validateAuth, deleteBuildingController.deleteBuilding);

router.get('/buildingsList', validateAuth, buildingListController.getAllBuildings);

router.put('/updateSubscription', validateAuth, updateBuildingSubscriptionController.updateSubscription);

module.exports = router;