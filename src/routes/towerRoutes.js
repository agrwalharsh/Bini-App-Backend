const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createTowerController = require('../controllers/tower/createTower')
const updateTowerController = require('../controllers/tower/updateTower')

router.post('/createTower', validateAuth, createTowerController.createTower);

router.put('/updateTower', validateAuth, updateTowerController.updateTower);

module.exports = router;