let postModel = require('../schemas/post')
var roomTypeModel = require('../schemas/roomType')
var postCategoryModel = require('../schemas/PostCategory')
let userModel = require('../schemas/user')
var imageProductModel = require('../schemas/postImages')
var imageProductController = require('../controllers/imageProduct')
const user = require('../schemas/user')
var servicesModel = require('../schemas/services')
var invoiceModel = require('../schemas/invoice')

module.exports = {
    GetAllPost: async function (currentPage = 1, limit = 6, city, district,  ward, roomType) {
        const filter = {
            isDeleted: false,
            approvalStatus: true
        };          
        if (city) filter['city'] = city;
        if (district) filter['district'] = district;
        if (ward) filter['ward'] = ward;
        let query = await postModel.find(
            filter
        ).sort({ createdAt: -1 }) 
        .populate({
            path: 'imageProducts', 
            select: 'urlImage'  
        }).populate({
            path: 'user',
            select: 'userName' 
        })
        .populate({
            path: 'postCategory',
            select: 'categoryName' 
        })
        .populate({
            path: 'roomType',
            select: 'typeName' 
        })
        .select('-roomType -createdAt -users -updatedAt -__v');
        if (roomType) {
            query = query.filter(post => post.roomType?.typeName === roomType);
        }
        const totalItems = query.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = query.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetPostByID: async function (id) {
        return await postModel.findById(id)
            .populate({ path: 'imageProducts', select: 'urlImage' })
            .populate({
                path: 'user',
                select: 'userName avatar phoneNumber' 
            }).populate({
                path: 'roomType',
                select: 'typeName' 
            })
            .select(' -users -updatedAt -__v');
    },
    GetPostByUserName: async function (userName, postType, currentPage = 1, limit = 1) {
        const user = await userModel.findOne({ userName: userName });
        let query =  await postModel.find({
             user: user._id,
        }).sort({ createdAt: -1 }) 
        .populate({
            path: 'imageProducts', 
            select: 'urlImage'  
        }).populate({
            path: 'user',
            select: 'userName' 
        })
        .populate({
            path: 'postCategory',
            select: 'categoryName' 
        })
        .select('-roomType -createdAt -users -updatedAt -__v');
        if (postType === "postDisplays") {
            query = query.filter(post => post.approvalStatus === true && post.isDeleted === false);
        }
        else if (postType === "postHidden") {
            query = query.filter(post => post.approvalStatus === true && post.isDeleted === true);
        }
        else if (postType === "postExpired") {
            query = query.filter(post => post.expirationDate < new Date() );
        } else if (postType === "postPending") {
            query = query.filter(post => post.approvalStatus === null );
        }
        else{
            query = query.filter(post => post.approvalStatus === false);
        }
        const totalItems = query.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = query.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetPostManager: async function (postType, currentPage = 1, limit = 1) {
        let query =  await postModel.find({
        })
        .sort({ createdAt: -1 }) 
        .populate({
            path: 'imageProducts', 
            select: 'urlImage'  
        }).populate({
            path: 'user',
            select: 'userName' 
        })
        .populate({
            path: 'postCategory',
            select: 'categoryName' 
        })
        .select('-roomType -createdAt -users -updatedAt -__v');
        if (postType === "postDisplays") {
            query = query.filter(post => post.approvalStatus === true && post.isDeleted === false);
        } else if (postType === "postPending") {
            query = query.filter(post => post.approvalStatus === null );
        }
        else{
            query = query.filter(post => post.approvalStatus === false);
        }
        const totalItems = query.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = query.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    CreateAPost: async function (title, area, description, city, district, ward,
         address, rentPrice,deposit,latitude, longitude, userId,roomTypeId, imageUrls) {
        try {
            let roomType = await roomTypeModel.findById(roomTypeId);
            let postCategory = await postCategoryModel.findOne({
                categoryName: "Tin thường"
            });
            let user = await userModel.findById(userId);
            if (roomType && postCategory && user) {
                let currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() + 3);
                let expiraDate = currentDate;
                let post = new postModel({

                    title: title,
                    area: area,
                    description: description,
                    city: city,
                    district: district,
                    ward: ward,
                    address: address,
                    rentPrice: rentPrice,
                    deposit: deposit,
                    latitude: latitude,
                    longitude: longitude,
                    approvalStatus: null,
                    user: user._id,
                    roomType: roomType._id,
                    expirationDate: expiraDate,
                    postCategory: postCategory._id,
                })
                await post.save();
                let imageIds = [];
                for (let url of imageUrls) {
                    let imageProduct = new imageProductModel({
                        urlImage: url, 
                        post: post._id  
                    });
                    let savedImage = await imageProduct.save();
                    imageIds.push(savedImage._id); 
                }
                post.imageProducts = imageIds;
                await post.save();
            } else {
                throw new Error("khong tim thay")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    UpdateAPost: async function (userId,postId, body) {
        try {
            let post = await postModel.findById(postId)
            if (post.user.toString() !== userId.toString()) {
                throw new Error("Bạn không có quyền sửa bài viết này.")
            }
            if(body.imageUrls && body.imageUrls.length > 0){
                await imageProductController.deleteImagesByPostId(post._id);
                var imageIds = [];
                for (let url of body.imageUrls) {
                    let imageProduct = new imageProductModel({
                        urlImage: url, 
                        post: post._id  
                    });
                    let savedImage = await imageProduct.save();
                    imageIds.push(savedImage._id); 
                }
                post.imageProducts = imageIds;
                await post.save();
            }
            let allowField = ["title", "area", "description", "city", "district", "ward",
                "address", "rentPrice","deposit","latitude", "longitude","roomType", "postCategory"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    post[key] = body[key];
                }
            }
            post.approvalStatus = null;
            post.isDeleted = false;
            
            return await post.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAPost: async function (id) {
    try {

        return await postModel.findByIdAndUpdate(
            id, {
            isDeleted: true,
            approvalStatus: false
        },{new: true }
        )
        } catch (error) {
            throw new Error(error.message)
        }
    },
    ShowPost: async function (userId,postId) {
        try {
            let post = await postModel.findById(postId)
            if (post.user.toString() !== userId.toString()) {
                throw new Error("Bạn không có quyền sửa bài viết này.")
            }
            return await postModel.findByIdAndUpdate(
                postId, {
                isDeleted: !post.isDeleted,
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
    ServicePost: async function (postId, userId, serviceId,day){
        let service = await servicesModel.findById(serviceId)
        let post = await postModel.findById(postId)
        if (post.user.toString() !== userId.toString()) {
            throw new Error("Bạn không có quyền")
        }
        if(!service && !post)
            throw new Error("Không tìm thấy")
        let content = service.serviceName +' cho "'+post.title+' "';
        let newInvoice = new invoiceModel({
            content: content,
            totalPrice: service.price*day,
            post: post._id,
            service: service._id,
        })
        await newInvoice.save()
        let category = await postCategoryModel.findOne({
            categoryName: service.serviceName
        })
        return await postModel.findByIdAndUpdate(
            postId, {
            postCategory: category._id,
            serviceEndDate: new Date(Date.now() + day * 24 * 60 * 60 * 1000)
        },{new: true }
        )
    },
    AcceptPost : async function (postId, status) {
        try {
            console.log(status)
            return await postModel.findByIdAndUpdate(
                postId, {
                approvalStatus: status,
            }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
    LikePost : async function (userId, postId) {
        try {
            let user = await userModel.findById(userId)
            const alreadyLiked = user.posts.includes(postId);
            if (alreadyLiked) {
                user.posts = user.posts.filter(id => id.toString() !== postId);
            } else {
                user.posts.push(postId);
            }
              await user.save();
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }, 
    GetLike: async function (userId, currentPage = 1, limit = 6) {

          try {
            let user = await userModel.findById(userId)
            .sort({ createdAt: -1 }) 
            .populate({
                path: 'posts',
                select: 'title area rentPrice city district',
                populate: [
                    { path: 'postCategory', select: 'categoryName' },
                    { path: 'imageProducts', select: 'urlImage' },
                    { path: 'user', select: 'userName' },
                ]
            });
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    },
    GetSuggestions: async function (query, limit = 5) {
        try {
            const suggestions = await postModel.find({
                isDeleted: false,
                approvalStatus: true,
                title: { $regex: query, $options: 'i' }
            })
            .select('title')
            .limit(limit);
        
            return suggestions.map(post => post.title);
          } catch (error) {
            console.error('Error getting title suggestions:', error);
            return [];
          }
    },
    GetPostResult: async function (query, currentPage = 1, limit = 6, city, district, ward, roomType) {
        const filter = {
            isDeleted: false,
            approvalStatus: true,
        };

        if (query) {
            filter.title = { $regex: query, $options: 'i' }; 
        }
        if (city) filter.city = city;
        if (district) filter.district = district;
        if (ward) filter.ward = ward;

        let querys = await postModel.find(filter)
            .sort({ createdAt: -1 }) 
            .populate({
                path: 'imageProducts',
                select: 'urlImage'
            })
            .populate({
                path: 'user',
                select: 'userName'
            })
            .populate({
                path: 'postCategory',
                select: 'categoryName'
            })
            .populate({
                path: 'roomType',
                select: 'typeName'
            })
            .select('-roomType -createdAt -users -updatedAt -__v');
            if (roomType) {
                querys = querys.filter(post => post.roomType?.typeName === roomType);
            }
            const totalItems = querys.length;
            const totalPage = Math.ceil(totalItems / limit);
            const startIndex = (currentPage - 1) * limit;
            const paginatedResults = querys.slice(startIndex, startIndex + limit);

            return {
                totalPage,
                currentPage,
                content: paginatedResults
            };
    }


}
