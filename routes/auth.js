var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
var roleController = require('../controllers/roles')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let crypto = require('crypto')
let { check_authentication } = require('../utils/check_auth');
const { validatorSigup, validate } = require('../utils/validators');

router.post('/login', async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.userName;
        let password = body.password;
        let user = await userController.CheckLogin(username, password);
        const token = jwt.sign({
            id: user._id,
            expire: (new Date(Date.now() + 60 * 60 * 1000)).getTime()
        }, constants.SECRET_KEY);
        
        CreateSuccessRes(res, {
            token: token,
            userName: user.userName,
            avatar: user.avatar,
            role: user.role.roleName,
        }, 200);
    } catch (error) {
        next(error)
    }
});

router.post('/signup',validatorSigup,validate, async function (req, res, next) {
    try {
        let body = req.body;
        let newUser = await userController.CreateAnUser(
            body.userName, body.password,body.phoneNumber, body.email, 'User'
        )
        CreateSuccessRes(res,newUser,200);
    } catch (error) {
        console.log(error);
        next(error)
    }
})


router.get('/me', check_authentication, async function (req, res, next) {
    CreateSuccessRes(res, req.user, 200)
})


module.exports = router;
