var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { check_authentication,check_authorization, check_me } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')
let multer = require('multer')
let path = require('path');
let axios = require("axios")
let FormData = require('form-data')
let fs = require('fs')
const {validate, validatorEdit } = require('../utils/validators');
let avatarDir = path.join(__dirname, '../cdn-server/avatars')
let postcdnURL = `http://localhost:4000/upload_avatar`
let jwt = require('jsonwebtoken')

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => cb(null,
      (new Date(Date.now())).getTime() + '-' + file.originalname
  )
})
//upload
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image/)) {
          cb(new Error("tao chi nhan anh? thoi"))
      }
      cb(null, true)
  }, limits: {
      fileSize: 10 * 1024 * 1024
  }
})

router.get('/', check_authentication,
  check_authorization(constants.ADMIN_PERMISSION)
,async function (req, res, next) {
  try {
    let { status, page, pageSize } = req.query;
    let users = await userController.GetAllUsers(status, page, pageSize);
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error)
  }
});

router.get('/:userName',async function (req, res, next) {
  try {
    let users = await userController.GetUserByUsername(req.params.userName);
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error)
  }
});

router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.CreateAnUser(
      body.userName, body.password,body.phoneNumber, body.email, body.role
    )
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/edit',check_authentication,upload.single('avatar'),validatorEdit,validate, async function (req, res, next) {
  try {
    let body = req.body
    if (req.file) {
        //co file
        let formData = new FormData();
        let avatarfile = path.join(avatarDir, req.file.filename);
        formData.append('avatar', fs.createReadStream(avatarfile));
        let result = await axios.post(
            postcdnURL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        fs.unlinkSync(avatarfile);
        body.avatar = result.data.data.url

    }
    
    let user = await userController.UpdateAnUser(req.user, body)
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
router.delete('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let user = await userController.DeleteAnUser(req.params.id)
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error)
  }
});




module.exports = router;
