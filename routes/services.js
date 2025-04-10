
var express = require('express');
var router = express.Router();
let servicesController = require('../controllers/services')
let { check_authentication,check_authorization, check_me } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')

router.get('/', async function (req, res, next) {
  try {
    let {status, page, pageSize} = req.query
    let service = await servicesController.GetAllServices(status, page, pageSize);
    CreateSuccessRes(res, service, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/user', async function (req, res, next) {
  try {
    let service = await servicesController.GetServicesOfUser();
    CreateSuccessRes(res, service, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/:name', async function (req, res, next) {
    try {
      let service = await servicesController.GetServicesByServiceName(req.params.name);
      CreateSuccessRes(res, service, 200);
    } catch (error) {
      next(error)
    }
});
router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let service = await servicesController.CreateAServices(
      body.serviceName, body.price
    )
    CreateSuccessRes(res, service, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let service = await servicesController.UpdateAServices(req.params.id, body)
    CreateSuccessRes(res, service, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let service = await servicesController.DeleteAServices(req.params.id)
    CreateSuccessRes(res, service, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
