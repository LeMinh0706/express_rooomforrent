
var express = require('express');
var router = express.Router();
let reviewsController = require('../controllers/reviews')
let { check_authentication,check_authorization } = require('../utils/check_auth')
let { CreateSuccessRes } = require('../utils/responseHandler')
let constants = require('../utils/constants')

router.get('/:userId', async function (req, res, next) {
  try {
    let {page , pageSize } = req.query
    let reviews = await reviewsController.GetReviewsByUser(req.params.userId,page , pageSize);
    CreateSuccessRes(res, reviews, 200);
  } catch (error) {
    next(error)
  }
});

router.post('/:userId',check_authentication, async function (req, res, next) {
    try {
      let reviews = await reviewsController.CreateAReview(req.user?.id,req.params.userId,req.body.content);
      CreateSuccessRes(res, reviews, 200);
    } catch (error) {
      next(error)
    }
});

router.put('/:reviewId',check_authentication, async function (req, res, next) {
    try {
      let reviews = await reviewsController.UpdateAReview(req.user?.id,req.params.reviewId,req.body.content);
      CreateSuccessRes(res, reviews, 200);
    } catch (error) {
      next(error)
    }
});

router.delete('/:reviewId',check_authentication, async function (req, res, next) {
    try {
      let reviews = await reviewsController.DeleteAReview(req.user?.id,req.params.reviewId);
      CreateSuccessRes(res, reviews, 200);
    } catch (error) {
      next(error)
    }
});
module.exports = router;
