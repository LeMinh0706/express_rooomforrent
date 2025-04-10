var express = require('express');
var router = express.Router();
let postCategoryController = require('../controllers/postCategory')
let { check_authentication,check_authorization, check_me } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')

router.get('/', async function (req, res, next) {
  try {
    let {status, page, pageSize} = req.query
    let poatCategory = await postCategoryController.GetAllPostCategory(status, page, pageSize);
    CreateSuccessRes(res, poatCategory, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/:name', async function (req, res, next) {
    try {
      let categorys = await postCategoryController.GetCategoryByName(req.params.name);
      CreateSuccessRes(res, categorys, 200);
    } catch (error) {
      next(error)
    }
});
router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let poatCategory = await postCategoryController.CreateAPostCategory(
      body.categoryName
    )
    CreateSuccessRes(res, poatCategory, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let poatCategory = await postCategoryController.UpdateAPostCategory(req.params.id, body)
    CreateSuccessRes(res, poatCategory, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let poatCategory = await postCategoryController.DeleteAPostCategory(req.params.id)
    CreateSuccessRes(res, poatCategory, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
