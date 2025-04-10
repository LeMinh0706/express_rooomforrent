var express = require('express');
var router = express.Router();
let roomTypeController = require('../controllers/roomType')
let { check_authentication,check_authorization, check_me } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')

router.get('/', async function (req, res, next) {
  try {
    let {status, page, pageSize} = req.query
    let roomType = await roomTypeController.GetAllRoomType(status, page, pageSize);
    CreateSuccessRes(res, roomType, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/:name', async function (req, res, next) {
    try {
      let roomType = await roomTypeController.GetRoomTypeName(req.params.name);
      CreateSuccessRes(res, roomType, 200);
    } catch (error) {
      next(error)
    }
});
router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let roomType = await roomTypeController.CreateARoomType(
      body.typeName
    )
    CreateSuccessRes(res, roomType, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let roomType = await roomTypeController.UpdateARoomType(req.params.id, body)
    CreateSuccessRes(res, roomType, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let roomType = await roomTypeController.DeleteARoomType(req.params.id)
    CreateSuccessRes(res, roomType, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
