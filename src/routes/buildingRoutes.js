const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createBuildingController = require('../controllers/building/createBuilding')
const createBuildingAdminController = require('../controllers/building/createBuildingAdmin')
const buildingListController = require('../controllers/building/buildingList')
const buildingDataController = require('../controllers/building/buildingData')
const updateBuildingSubscriptionController = require('../controllers/building/updateBuildingSubscription')
const subscriptionStatusController = require('../controllers/building/subscriptionStatus')
const buildingsListWithStartDate = require('../controllers/building/buildingsStartDate')
const createTowerController = require('../controllers/building/tower/createTower')
const updateTowerController = require('../controllers/building/tower/updateTower')
const buildingTowerDataController = require('../controllers/building/buildingTowerData')
const deleteBuildingController = require('../controllers/building/deleteBuilding')
const updateBuildingAdminController = require('../controllers/building/updateBuildingAdmin')
const updateBuildingController = require('../controllers/building/updateBuilding')

router.post('/buildingRegistration', validateAuth, createBuildingController.createBuilding);

router.put('/updateBuilding', validateAuth, updateBuildingController.updateBuildingDetails);

router.post('/buildingAdminRegistration', validateAuth, createBuildingAdminController.createBuildingAdmin);

router.put('/updateBuildingAdmin', validateAuth, updateBuildingAdminController.updateBuildingAdmin);

router.get('/buildingsList', validateAuth, buildingListController.getAllBuildings);

router.put('/updateSubscription', validateAuth, updateBuildingSubscriptionController.updateSubscription);

router.get('/subscriptionStatus', validateAuth, subscriptionStatusController.getAllBuildingsSortedBySubscription);

router.get('/buildingsListWithStartDate', validateAuth, buildingsListWithStartDate.getBuildingsListWithStartDate);

router.get('/:id/previous-start-dates', buildingDataController.getBuildingPreviousStartDates);

//Tower

router.post('/createTower', validateAuth, createTowerController.createTower);

router.put('/updateTower', validateAuth, updateTowerController.updateTower);

router.get('/buildingTowerDetails', validateAuth, buildingTowerDataController.getBuildingsTowerData);

router.delete('/deleteBuilding', validateAuth, deleteBuildingController.deleteBuilding);

module.exports = router;