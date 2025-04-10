var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles')
let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler');
let { check_authentication,check_authorization } = require('../utils/check_auth')
let constants = require('../utils/constants')

router.get('/', async function(req, res, next) {
  let roles = await roleController.GetAllRoles();
  CreateSuccessRes(res,roles,200);
});

router.get('/:id', async function(req, res, next) {
   let roles = await roleController.GetRoleById(req.params.id)
   CreateSuccessRes(res,roles,200);
 });
router.post('/', async function(req, res, next) {
 try {
    let newRole = await roleController.CreateARole(req.body.roleName);
    CreateSuccessRes(res,newRole,200);
 } catch (error) {
    next(error)
 }
});

router.put('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
   try {
      let body = req.body
      let role= await roleController.UpdateARole(req.params.id, body)
      CreateSuccessRes(res,role,200);
   } catch (error) {
      next(error)
   }
  });


module.exports = router;
