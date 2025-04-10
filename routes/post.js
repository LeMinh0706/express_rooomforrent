var express = require('express');
var router = express.Router();
let postController = require('../controllers/post')
let { check_authentication,check_authorization, check_me } = require('../utils/check_auth')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')
let multer = require('multer')
let path = require('path');
let axios = require("axios")
let FormData = require('form-data')
let fs = require('fs')
let imageDir = path.join(__dirname, '../cdn-server/posts')
let postcdnURL = `http://localhost:4000/upload_image`

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
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

router.get('/', async function (req, res, next) {
  try {
    const { page, pageSize, city, district, ward, roomType } = req.query;
    let post = await postController.GetAllPost( page, pageSize,city, district, ward, roomType );
    CreateSuccessRes(res, post, 200);
  } catch (error) {
    next(error)
  }
});
router.get('/manager',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    const { postType, page, pageSize } = req.query;
    let post = await postController.GetPostManager(postType, page, pageSize);
    CreateSuccessRes(res, post, 200);
  } catch (error) {
      CreateErrorRes(res, "Không tìm thấy", 404);
  }
});
router.get('/like',check_authentication, async function (req, res, next) {
  try {
        let {page, pageSize} = req.query
        let data = await postController.GetLike(req.user?.id,page, pageSize)
        CreateSuccessRes(res, {
          likePost: data.posts
      }, 200);
    } catch (error) {
        next(error)
    }
});
router.get('/:id', async function (req, res, next) {
    try {
      let post = await postController.GetPostByID(req.params.id);
      CreateSuccessRes(res, post, 200);
    } catch (error) {
        CreateErrorRes(res, "Không tìm thấy", 404);
    }
});




router.get('/user/:userName', async function (req, res, next) {
    try {
    const { postType, page, pageSize } = req.query;
      let post = await postController.GetPostByUserName(req.params.userName,postType, page, pageSize);
      CreateSuccessRes(res, post, 200);
    } catch (error) {
        next(error)
    }
});

router.post('/',check_authentication,upload.array('images', 30), async function (req, res, next) {
  try {
        let body = req.body
        if (!req.files || req.files.length === 0) {
          throw new Error("Không có file");
        }
        let imageUrls = [];
    
        for (let file of req.files) {
          const formData = new FormData();
          const filePath = path.join(imageDir, file.filename);
          formData.append('imageProduct', fs.createReadStream(filePath));
    
          const result = await axios.post(postcdnURL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
    
          fs.unlinkSync(filePath); 
          imageUrls.push(result.data.data.url); 
        }
        body.imageUrls = imageUrls
        let post = await postController.CreateAPost(
            body.title, body.area, body.description, body.city, body.district, body.ward,
            body.address, body.rentPrice,body.deposit,body.latitude,body.longitude, req.user?.id,body.roomTypeId,
            body.imageUrls
        )
        CreateSuccessRes(res, 'Đăng bài thành công', 200);
    } catch (error) {
        next(error)
    }
});
router.put('/:id',check_authentication,upload.array('images', 30), async function (req, res, next) {
  try {
    let body = req.body
        if (req.files && req.files.length > 0) {
            let imageUrls = [];
    
            for (let file of req.files) {
              const formData = new FormData();
              const filePath = path.join(imageDir, file.filename);
              formData.append('imageProduct', fs.createReadStream(filePath));
        
              const result = await axios.post(postcdnURL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
        
              fs.unlinkSync(filePath); 
              imageUrls.push(result.data.data.url); 
            }
            body.imageUrls = imageUrls
        }
    const userIdFromToken = req.user?.id;  
    let post = await postController.UpdateAPost(userIdFromToken,req.params.id, body)
    CreateSuccessRes(res, post, 200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let post = await postController.DeleteAPost(req.params.id)
    CreateSuccessRes(res, post, 200);
  } catch (error) {
    next(error)
  }
});
router.put('/show/:id',check_authentication, async function (req, res, next) {
  try {
    let post = await postController.ShowPost(req.user?.id, req.params.id)
    CreateSuccessRes(res, post, 200);
  } catch (error) {
    next(error)
  }
});

router.post('/service/:id',check_authentication, async function (req, res, next) {
  try {
      let body = req.body
        let data = await postController.ServicePost(req.params.id, req.user?.id, body.service, body.day)
        CreateSuccessRes(res, data, 200);
    } catch (error) {
        next(error)
    }
});

router.put('/accept/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
      let body = req.body
        let data = await postController.AcceptPost(req.params.id, body.status)
        CreateSuccessRes(res, data, 200);
    } catch (error) {
        next(error)
    }
});
router.post('/like/:postId',check_authentication, async function (req, res, next) {
  try {
        let data = await postController.LikePost(req.user?.id,req.params.postId)
        CreateSuccessRes(res, {
          likePost: data.posts
      }, 200);
    } catch (error) {
        next(error)
    }
});
router.get('/search/suggestions', async (req, res) => {
  try {

    let data = await postController.GetSuggestions(req.query.query)
    CreateSuccessRes(res,data , 200);
  } catch (error) {
      next(error)
  }
});
router.get('/search/result', async (req, res) => {
  try {
    const { query, page, pageSize, city, district, ward, roomType } = req.query;
    let data = await postController.GetPostResult(query, page, pageSize, city, district, ward, roomType)
    CreateSuccessRes(res, data , 200);
  } catch (error) {
      next(error)
  }
});
module.exports = router;
