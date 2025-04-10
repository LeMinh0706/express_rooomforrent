
var reviewsModel = require('../schemas/reviews')
module.exports = {
    GetReviewsByUser: async function(userId, currentPage = 1, limit = 5){
        let reviews =  await reviewsModel.find({
            isDeleted: false,
            reviewedUser: userId
        }).sort({ createdAt: -1 }) 
        .populate({
            path: 'user', 
            select: 'userName avatar'  
        });;
        const totalItems = reviews.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = reviews.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    CreateAReview:async function(userId, reviewedUserId, content){
       try {
        if(userId === reviewedUserId){
            throw new Error("Không được tự đánh giá")
        }
        let reviews = new reviewsModel({
            user: userId,
            reviewedUser: reviewedUserId,
            content: content
        })
        return await reviews.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateAReview: async function (userId, reviewId, content) {
        try {
            let review = await reviewsModel.findById(reviewId);
            if(userId != review.user.toString()){
                throw new Error("Bạn không có quyền")
            }
            
            return await reviewsModel.findByIdAndUpdate(
                reviewId, {
                content: content
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAReview: async function (userId, reviewId) {
        try {
            let review = await reviewsModel.findById(reviewId);
            if(userId != review.user.toString()){
                throw new Error("Bạn không có quyền")
            }
            return await reviewsModel.findByIdAndUpdate(
                reviewId, {
                isDeleted: true
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
}