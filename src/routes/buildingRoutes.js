const express = require('express');
const { validateAuth } = require('../auth/auth');
const router = express.Router();
const createBuildingController = require('../controllers/building/createBuilding');
const createBuildingAdminController = require('../controllers/building/createBuildingAdmin')
const buildingListController = require('../controllers/building/buildingList')
const buildingDataController = require('../controllers/building/buildingData')
const updateBuildingController = require('../controllers/building/updateBuilding')
const subscriptionStatusController = require('../controllers/building/subscriptionStatus')
const buildingsListWithStartDate = require('../controllers/building/buildingsStartDate')
const createTowerController = require('../controllers/building/tower/createTower')
const updateTowerController = require('../controllers/building/tower/updateTower')
const buildingTowerDataController = require('../controllers/building/buildingTowerData')


router.post('/buildingRegistration',  validateAuth, createBuildingController.createBuilding);

router.post('/buildingAdminRegistration',  validateAuth, createBuildingAdminController.createBuildingAdmin);

router.get('/buildingsList', validateAuth, buildingListController.getAllBuildings);

router.put('/updateSubscription', validateAuth, updateBuildingController.updateSubscription);

router.get('/subscriptionStatus', validateAuth, subscriptionStatusController.getAllBuildingsSortedBySubscription);

router.get('/buildingsListWithStartDate', validateAuth, buildingsListWithStartDate.getBuildingsListWithStartDate)

router.get('/:id/previous-start-dates', buildingDataController.getBuildingPreviousStartDates);

//Tower

router.post('/createTower', validateAuth, createTowerController.createTower);

router.put('/updateTower', validateAuth, updateTowerController.updateTower);

router.get('/buildingTowerDetails', validateAuth, buildingTowerDataController.getBuildingsTowerData);

module.exports = router;