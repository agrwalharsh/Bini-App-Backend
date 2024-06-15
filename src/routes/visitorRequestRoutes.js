const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createVisitorRequestController = require('../controllers/visitor/createVisitorRequest')
const getVisitorRequestsBySecurityController = require('../controllers/visitor/getVisitorRequestBySecurity')
const getVisitorRequestsByFlatAdminController = require('../controllers/visitor/getVisitorRequestByFlatUser')

router.post('/createRequest', validateAuth, createVisitorRequestController.createVisitorRequest)

router.get('/getRequestsBySecurity', validateAuth, getVisitorRequestsBySecurityController.getSecurityVisitorRequests)

router.get('/getRequestsByFlatAdmin', validateAuth, getVisitorRequestsByFlatAdminController.getFlatAdminVisitorRequests)

module.exports = router;