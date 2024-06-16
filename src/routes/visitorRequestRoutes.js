const express = require('express')
const { validateAuth } = require('../auth/auth')
const router = express.Router()
const createVisitorRequestController = require('../controllers/visitor/createVisitorRequest')
const getVisitorRequestsBySecurityController = require('../controllers/visitor/getVisitorRequestBySecurity')
const getVisitorRequestsByFlatAdminController = require('../controllers/visitor/getVisitorRequestByFlatUser')
const getFlatDetailsForSecurityController = require('../controllers/user/security/getFlatDetailsForSecurity')
const updateVisitorRequestStatusController = require('../controllers/visitor/updateVisitorRequestStatus')

router.post('/createRequest', validateAuth, createVisitorRequestController.createVisitorRequest)

router.get('/getRequestsBySecurity', validateAuth, getVisitorRequestsBySecurityController.getSecurityVisitorRequests)

router.get('/getRequestsByFlatAdmin', validateAuth, getVisitorRequestsByFlatAdminController.getFlatAdminVisitorRequests)

router.get('/getFlatDetailsForSecurity', validateAuth, getFlatDetailsForSecurityController.getFlatDetailsForSecurity)

router.post('/updateStatus', validateAuth, updateVisitorRequestStatusController.updateVisitorRequestStatus)

module.exports = router;