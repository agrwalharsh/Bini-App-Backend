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

router.post('/buildingRegistration',  validateAuth, createBuildingController.createBuilding);

router.post('/buildingAdminRegistration',  validateAuth, createBuildingAdminController.createBuildingAdmin);

router.get('/buildingsList', validateAuth, buildingListController.getAllBuildings);

router.put('/updateSubscription', validateAuth, updateBuildingController.updateSubscription);

router.get('/subscriptionStatus', validateAuth, subscriptionStatusController.getAllBuildingsSortedBySubscription);

router.get('/buildingsListWithStartDate', validateAuth, buildingsListWithStartDate.getBuildingsListWithStartDate)

router.get('/:id/previous-start-dates', buildingDataController.getBuildingPreviousStartDates);

module.exports = router;