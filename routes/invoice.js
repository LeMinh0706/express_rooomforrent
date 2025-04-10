var express = require('express');
var router = express.Router();
var invoiceController = require('../controllers/invoice')
let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler');
let { check_authentication,check_authorization } = require('../utils/check_auth')
let constants = require('../utils/constants')


router.get('/history',check_authentication, async function(req, res, next) {
 try {
    let { page, pageSize, service } = req.query;
    let invoice = await invoiceController.GetInvoiceByUser(req.user?.id ,service,page, pageSize);
    CreateSuccessRes(res,invoice,200);
 } catch (error) {
    next(error)
 }
});

router.get('/statistic',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
       let { year } = req.query;
       let invoice = await invoiceController.GetStatistic(year);
       CreateSuccessRes(res,invoice,200);
    } catch (error) {
       next(error)
    }
});

router.get('/statistic/time',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
       let { year, month } = req.query;
       let invoice = await invoiceController.GetStatisticByTime(year ,month );
       CreateSuccessRes(res,invoice,200);
    } catch (error) {
       next(error)
    }
});

module.exports = router;
